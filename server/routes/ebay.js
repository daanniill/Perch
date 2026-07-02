const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../db/client')

// ── helpers ───────────────────────────────────────────────────────────────────

function ebayBase() {
  return process.env.EBAY_ENVIRONMENT === 'production'
    ? 'https://api.ebay.com'
    : 'https://api.sandbox.ebay.com'
}

function ebayAuthBase() {
  return process.env.EBAY_ENVIRONMENT === 'production'
    ? 'https://auth.ebay.com'
    : 'https://auth.sandbox.ebay.com'
}

function basicAuth() {
  return Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString('base64')
}

const SCOPES = [
  'https://api.ebay.com/oauth/api_scope',
  'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
  'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
].join(' ')

async function refreshIfNeeded(conn) {
  if (new Date(conn.token_expires_at) > new Date(Date.now() + 60_000)) return conn

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: conn.refresh_token,
    scope: SCOPES,
  })
  const r = await fetch(`${ebayBase()}/identity/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })
  if (!r.ok) throw new Error('Failed to refresh eBay token')
  const data = await r.json()

  const expires = new Date(Date.now() + data.expires_in * 1000)
  await db.query(
    `UPDATE ebay_connections SET access_token=$1, token_expires_at=$2, updated_at=NOW() WHERE user_id=$3`,
    [data.access_token, expires, conn.user_id]
  )
  return { ...conn, access_token: data.access_token, token_expires_at: expires }
}

// ── in-memory sync state ──────────────────────────────────────────────────────
// Resets on server restart — intentional for this MVP.
const syncState = new Map()

async function runSync(userId, accessToken) {
  syncState.set(userId, { syncing: true, progress: 0, listingCount: 0, orderCount: 0 })

  try {
    // --- Phase 1: fetch all offers → build price/status/listed_at map keyed by SKU ---
    const offerMap = {}
    let offerOffset = 0
    let offerTotal = 1
    while (offerOffset < offerTotal) {
      const r = await fetch(
        `${ebayBase()}/sell/inventory/v1/offer?limit=100&offset=${offerOffset}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (!r.ok) break
      const data = await r.json()
      offerTotal = data.total ?? 0
      for (const offer of data.offers ?? []) {
        if (!offer.sku) continue
        const rawPrice = offer.pricingSummary?.price?.value ?? offer.price?.value ?? null
        const st = (offer.status ?? '').toLowerCase()
        offerMap[offer.sku] = {
          price:       rawPrice != null ? parseFloat(rawPrice) : null,
          status:      st === 'published' ? 'active' : st === 'ended' ? 'unsold' : 'draft',
          listed_at:   offer.listingStartDate ?? null,
          listing_url: offer.listingId
            ? `https://www.${process.env.EBAY_ENVIRONMENT === 'production' ? '' : 'sandbox.'}ebay.com/itm/${offer.listingId}`
            : null,
        }
      }
      offerOffset += (data.offers ?? []).length || 1
    }
    syncState.set(userId, { syncing: true, progress: 15, listingCount: 0, orderCount: 0 })

    // --- Phase 2: sync inventory items ---
    let offset = 0
    let total = 1
    let listingCount = 0

    while (offset < total) {
      const r = await fetch(
        `${ebayBase()}/sell/inventory/v1/inventory_item?limit=100&offset=${offset}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (!r.ok) break
      const data = await r.json()
      total = data.total ?? 0
      const items = data.inventoryItems ?? []

      for (const item of items) {
        const title  = item.product?.title ?? null
        const qty    = item.availability?.shipToLocationAvailability?.quantity ?? 0
        const img    = item.product?.imageUrls?.[0] ?? null
        const offer  = offerMap[item.sku] ?? {}
        await db.query(
          `INSERT INTO ebay_listings
             (user_id, ebay_item_id, title, quantity, image_url, price, status, listed_at, listing_url, synced_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
           ON CONFLICT (user_id, ebay_item_id) DO UPDATE
             SET title=$3, quantity=$4, image_url=$5, price=$6, status=$7,
                 listed_at=$8, listing_url=$9, synced_at=NOW()`,
          [userId, item.sku, title, qty, img,
           offer.price ?? null, offer.status ?? 'active',
           offer.listed_at ?? null, offer.listing_url ?? null]
        )
        listingCount++
      }

      offset += items.length || 1
      syncState.set(userId, { syncing: true, progress: 15 + Math.floor((offset / (total || 1)) * 35), listingCount, orderCount: 0 })
    }

    // --- Phase 3: sync orders ---
    let orderOffset = 0
    let orderTotal = 1
    let orderCount = 0

    while (orderOffset < orderTotal) {
      const r = await fetch(
        `${ebayBase()}/sell/fulfillment/v1/order?limit=50&offset=${orderOffset}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (!r.ok) break
      const data = await r.json()
      orderTotal = data.total ?? 0
      const orders = data.orders ?? []

      for (const order of orders) {
        const lineItems  = order.lineItems ?? []
        const firstItem  = lineItems[0]
        const shipping   = firstItem?.deliveryCost?.shippingCost?.value ?? null
        const fee        = order.totalMarketplaceFee?.value ?? null
        const total      = order.totalFeeBasisAmount?.value ?? null
        const orderedAt  = order.creationDate ? new Date(order.creationDate) : null
        const itemTitle  = firstItem?.title ?? null
        const itemSku    = firstItem?.sku   ?? null

        await db.query(
          `INSERT INTO ebay_orders
             (user_id, ebay_order_id, total_amount, currency, status, buyer_username,
              item_count, shipping_cost, ebay_fees, ordered_at, item_title, item_sku, synced_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW())
           ON CONFLICT (user_id, ebay_order_id) DO UPDATE
             SET status=$5, item_title=$11, item_sku=$12, synced_at=NOW()`,
          [
            userId, order.orderId, total,
            order.totalFeeBasisAmount?.currency ?? 'USD',
            order.orderFulfillmentStatus ?? null,
            order.buyer?.username ?? null,
            lineItems.length, shipping, fee, orderedAt,
            itemTitle, itemSku,
          ]
        )
        orderCount++
      }

      orderOffset += orders.length || 1
      syncState.set(userId, {
        syncing: true,
        progress: 50 + Math.floor((orderOffset / (orderTotal || 1)) * 50),
        listingCount,
        orderCount,
      })
    }

    await db.query(`UPDATE ebay_connections SET last_synced_at=NOW() WHERE user_id=$1`, [userId])
    syncState.set(userId, { syncing: false, progress: 100, listingCount, orderCount })
  } catch (err) {
    console.error('[sync]', err.message)
    syncState.set(userId, { syncing: false, progress: 0, listingCount: 0, orderCount: 0, error: err.message })
  }
}

// ── auth sub-router (mounted at /auth/ebay) ───────────────────────────────────

const authRouter = express.Router()

// GET /auth/ebay/callback — called by eBay after user authorizes
authRouter.get('/callback', async (req, res) => {
  const { code, state, error } = req.query
  if (error) return res.redirect(`${process.env.FRONTEND_URL}/?ebay=error#/onboarding`)
  if (!code || !state) return res.redirect(`${process.env.FRONTEND_URL}/?ebay=error#/onboarding`)

  let userId
  try {
    const payload = jwt.verify(state, process.env.JWT_SECRET)
    userId = payload.userId
  } catch {
    return res.redirect(`${process.env.FRONTEND_URL}/?ebay=error#/onboarding`)
  }

  try {
  console.log('[ebay callback] exchanging code for tokens, userId:', userId)
  // Exchange code for eBay tokens
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.EBAY_RUNAME,
  })
  const tokenRes = await fetch(`${ebayBase()}/identity/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  console.log('[ebay callback] token exchange status:', tokenRes.status)
  if (!tokenRes.ok) {
    console.error('[ebay callback] token exchange failed:', await tokenRes.text())
    return res.redirect(`${process.env.FRONTEND_URL}/?ebay=error#/onboarding`)
  }

  const tokens = await tokenRes.json()
  const expires = new Date(Date.now() + tokens.expires_in * 1000)

  // Fetch eBay user info to get store name
  let ebayUserId = null
  let storeName = null
  try {
    const meRes = await fetch(`${ebayBase()}/commerce/identity/v1/user/`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    if (meRes.ok) {
      const me = await meRes.json()
      ebayUserId = me.userId ?? null
      storeName = me.username ?? null
    }
  } catch {}

  await db.query(
    `INSERT INTO ebay_connections (user_id, access_token, refresh_token, token_expires_at, ebay_user_id, store_name)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (user_id) DO UPDATE
       SET access_token=$2, refresh_token=$3, token_expires_at=$4, ebay_user_id=$5, store_name=$6, updated_at=NOW()`,
    [userId, tokens.access_token, tokens.refresh_token, expires, ebayUserId, storeName]
  )

  console.log('[ebay callback] success, redirecting to frontend')
  // Put param before # so window.location.search picks it up in the SPA
  res.redirect(`${process.env.FRONTEND_URL}/?ebay=connected#/onboarding`)
  } catch (err) {
    console.error('[ebay callback] unexpected error:', err.message)
    if (!res.headersSent) res.redirect(`${process.env.FRONTEND_URL}/?ebay=error#/onboarding`)
  }
})

// ── api sub-router (mounted at /api/ebay, protected by requireAuth) ───────────

const apiRouter = express.Router()

// GET /api/ebay/auth-url — frontend calls this first, then redirects to the returned URL
apiRouter.get('/auth-url', (req, res) => {
  const state = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '10m' })
  const url = new URL(`${ebayAuthBase()}/oauth2/authorize`)
  url.searchParams.set('client_id', process.env.EBAY_CLIENT_ID)
  url.searchParams.set('redirect_uri', process.env.EBAY_RUNAME)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', SCOPES)
  url.searchParams.set('state', state)
  res.json({ url: url.toString() })
})

// GET /api/ebay/sync-status
apiRouter.get('/sync-status', async (req, res) => {
  try {
    const userId = req.user.id

    const { rows } = await db.query(
      `SELECT ec.store_name, ec.last_synced_at,
              (SELECT COUNT(*) FROM ebay_listings WHERE user_id=$1) AS listing_count,
              (SELECT COUNT(*) FROM ebay_orders   WHERE user_id=$1) AS order_count
       FROM ebay_connections ec WHERE ec.user_id=$1`,
      [userId]
    )

    const conn = rows[0] ?? null
    const state = syncState.get(userId) ?? { syncing: false, progress: 0 }

    res.json({
      connected: !!conn,
      storeName: conn?.store_name ?? null,
      lastSyncedAt: conn?.last_synced_at ?? null,
      syncing: state.syncing,
      progress: state.progress,
      listingCount: Number(conn?.listing_count ?? 0),
      orderCount: Number(conn?.order_count ?? 0),
    })
  } catch (err) {
    console.error('[ebay/sync-status]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/ebay/sync — kicks off background sync
apiRouter.post('/sync', async (req, res) => {
  try {
    const userId = req.user.id
    const current = syncState.get(userId)
    if (current?.syncing) return res.json({ syncing: true, message: 'Already syncing' })

    const { rows } = await db.query(
      `SELECT * FROM ebay_connections WHERE user_id=$1`,
      [userId]
    )
    if (!rows[0]) return res.status(400).json({ error: 'No eBay connection found' })

    const conn = await refreshIfNeeded(rows[0])

    // Run async — don't await
    runSync(userId, conn.access_token)

    res.json({ syncing: true })
  } catch (err) {
    console.error('[ebay/sync]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = { auth: authRouter, api: apiRouter }
