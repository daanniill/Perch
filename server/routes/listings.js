const express = require('express')
const db = require('../db/client')

const router = express.Router()

// Map UI tab keys to the DB status values the eBay sync writes
const STATUS_FILTER = {
  active: ['published', 'active', 'PUBLISHED'],
  sold:   ['ended_with_sales', 'sold', 'ENDED_WITH_SALES'],
  draft:  ['unpublished', 'draft', 'UNPUBLISHED'],
  unsold: ['ended_without_sales', 'unsold', 'ended', 'ENDED', 'ENDED_WITHOUT_SALES'],
}

function normalizeStatus(s) {
  if (!s) return 'active'
  const lower = s.toLowerCase()
  if (['published', 'active'].includes(lower)) return 'active'
  if (['ended_with_sales', 'sold'].includes(lower)) return 'sold'
  if (['unpublished', 'draft'].includes(lower)) return 'draft'
  return 'unsold'
}

// GET /api/listings?status=active&search=&page=1&limit=50
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id
    const { status, search } = req.query
    const page   = Math.max(1, parseInt(req.query.page  || '1'))
    const limit  = Math.min(100, parseInt(req.query.limit || '50'))
    const offset = (page - 1) * limit

    const conditions = ['l.user_id = $1']
    const params = [userId]

    if (status && status !== 'all' && STATUS_FILTER[status]) {
      params.push(STATUS_FILTER[status])
      conditions.push(`LOWER(l.status) = ANY($${params.length}::text[])`)
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`)
      conditions.push(`LOWER(l.title) LIKE $${params.length}`)
    }

    const where = conditions.join(' AND ')

    const [listRes, countRes] = await Promise.all([
      db.query(`
        SELECT ebay_item_id, title, category, price, status,
               quantity, quantity_sold, listed_at, listing_url, image_url
          FROM ebay_listings l
         WHERE ${where}
         ORDER BY listed_at DESC NULLS LAST, synced_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `, [...params, limit, offset]),
      db.query(`
        SELECT LOWER(status) AS status, COUNT(*) AS cnt
          FROM ebay_listings
         WHERE user_id = $1
         GROUP BY LOWER(status)
      `, [userId]),
    ])

    // Build per-tab counts
    const counts = { all: 0, active: 0, sold: 0, draft: 0, unsold: 0 }
    for (const r of countRes.rows) {
      const key = normalizeStatus(r.status)
      counts[key] = (counts[key] || 0) + +r.cnt
      counts.all += +r.cnt
    }

    res.json({
      listings: listRes.rows.map(r => ({
        id:           r.ebay_item_id,
        title:        r.title,
        category:     r.category,
        price:        r.price != null ? +r.price : null,
        status:       normalizeStatus(r.status),
        quantity:     r.quantity,
        quantity_sold: r.quantity_sold,
        listed_at:    r.listed_at,
        listing_url:  r.listing_url,
        image_url:    r.image_url,
      })),
      total:  counts.all,
      counts,
    })
  } catch (err) {
    console.error('[listings]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
