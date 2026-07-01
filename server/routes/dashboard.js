const express = require('express')
const db = require('../db/client')

const router = express.Router()

// Whitelisted SQL fragments — never built from user input
const PERIOD = {
  today: {
    cur:  `ordered_at >= CURRENT_DATE`,
    prev: `ordered_at >= CURRENT_DATE - INTERVAL '1 day' AND ordered_at < CURRENT_DATE`,
  },
  '7d': {
    cur:  `ordered_at >= NOW() - INTERVAL '7 days'`,
    prev: `ordered_at >= NOW() - INTERVAL '14 days' AND ordered_at < NOW() - INTERVAL '7 days'`,
  },
  '30d': {
    cur:  `ordered_at >= NOW() - INTERVAL '30 days'`,
    prev: `ordered_at >= NOW() - INTERVAL '60 days' AND ordered_at < NOW() - INTERVAL '30 days'`,
  },
  '12mo': {
    cur:  `ordered_at >= NOW() - INTERVAL '12 months'`,
    prev: `ordered_at >= NOW() - INTERVAL '24 months' AND ordered_at < NOW() - INTERVAL '12 months'`,
  },
}

// GET /api/dashboard/summary?period=30d
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id
    const p = PERIOD[req.query.period] ?? PERIOD['30d']

    const [cur, prev] = await Promise.all([
      db.query(`
        SELECT COALESCE(SUM(total_amount), 0)   AS rev,
               COALESCE(SUM(ebay_fees), 0)      AS fees,
               COALESCE(SUM(shipping_cost), 0)  AS ship,
               COUNT(*)                          AS orders
          FROM ebay_orders
         WHERE user_id = $1 AND status NOT IN ('CANCELLED') AND ${p.cur}
      `, [userId]),
      db.query(`
        SELECT COALESCE(SUM(total_amount), 0)   AS rev,
               COALESCE(SUM(ebay_fees), 0)      AS fees,
               COALESCE(SUM(shipping_cost), 0)  AS ship,
               COUNT(*)                          AS orders
          FROM ebay_orders
         WHERE user_id = $1 AND status NOT IN ('CANCELLED') AND ${p.prev}
      `, [userId]),
    ])

    const c = cur.rows[0]
    const v = prev.rows[0]

    const rev    = +c.rev
    const fees   = +c.fees
    const ship   = +c.ship
    const gp     = rev - fees - ship
    const orders = +c.orders

    const pRev    = +v.rev
    const pFees   = +v.fees
    const pShip   = +v.ship
    const pGp     = pRev - pFees - pShip
    const pOrders = +v.orders

    const pct = (a, b) => (b > 0 ? (a - b) / b * 100 : null)

    res.json({
      revenue:         rev,
      fees,
      shipping:        ship,
      gross_profit:    gp,
      gross_margin:    rev > 0 ? gp / rev * 100 : 0,
      orders,
      avg_order_value: orders > 0 ? rev / orders : 0,
      deltas: {
        revenue:      pct(rev, pRev),
        gross_profit: pct(gp, pGp),
        orders:       orders - pOrders,
      },
    })
  } catch (err) {
    console.error('[dashboard/summary]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/dashboard/chart?gran=monthly
router.get('/chart', async (req, res) => {
  try {
    const userId = req.user.id
    const gran   = req.query.gran === 'yearly' ? 'year' : 'month'
    const count  = gran === 'year' ? 5 : 6
    const fmt    = gran === 'year' ? 'YYYY' : 'Mon'

    const { rows } = await db.query(`
      SELECT DATE_TRUNC($1, ordered_at)               AS bucket,
             TO_CHAR(DATE_TRUNC($1, ordered_at), $2)  AS label,
             COALESCE(SUM(total_amount), 0)            AS rev,
             COALESCE(SUM(ebay_fees), 0)               AS fees,
             COALESCE(SUM(shipping_cost), 0)           AS ship
        FROM ebay_orders
       WHERE user_id = $3
         AND status NOT IN ('CANCELLED')
         AND ordered_at >= NOW() - ($4 || ' ' || $1 || 's')::INTERVAL
       GROUP BY bucket
       ORDER BY bucket
    `, [gran, fmt, userId, count])

    res.json({
      labels:       rows.map(r => r.label),
      revenue:      rows.map(r => +r.rev),
      gross_profit: rows.map(r => Math.max(0, +r.rev - +r.fees - +r.ship)),
    })
  } catch (err) {
    console.error('[dashboard/chart]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/dashboard/recent-sales
router.get('/recent-sales', async (req, res) => {
  try {
    const userId = req.user.id

    const { rows } = await db.query(`
      SELECT o.total_amount, o.ebay_fees, o.shipping_cost, o.status,
             o.ordered_at, o.item_title, o.item_sku, l.category
        FROM ebay_orders o
        LEFT JOIN ebay_listings l
          ON l.user_id = o.user_id AND l.ebay_item_id = o.item_sku
       WHERE o.user_id = $1 AND o.status NOT IN ('CANCELLED')
       ORDER BY o.ordered_at DESC
       LIMIT 5
    `, [userId])

    res.json(rows.map(r => {
      const total = +r.total_amount || 0
      const fees  = +r.ebay_fees   || 0
      const ship  = +r.shipping_cost || 0
      const gp    = total - fees - ship
      return {
        title:        r.item_title ?? 'eBay sale',
        category:     r.category  ?? null,
        total,
        gross_profit: gp,
        margin:       total > 0 ? (gp / total * 100).toFixed(0) : null,
        status:       r.status,
        ordered_at:   r.ordered_at,
      }
    }))
  } catch (err) {
    console.error('[dashboard/recent-sales]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/dashboard/categories
router.get('/categories', async (req, res) => {
  try {
    const userId = req.user.id

    // Try revenue-by-category via order→listing join (works after re-sync with item_sku)
    const { rows: revRows } = await db.query(`
      SELECT l.category               AS name,
             SUM(o.total_amount)      AS revenue
        FROM ebay_orders o
        JOIN ebay_listings l
          ON l.user_id = o.user_id AND l.ebay_item_id = o.item_sku
       WHERE o.user_id = $1
         AND l.category IS NOT NULL
         AND o.status NOT IN ('CANCELLED')
       GROUP BY l.category
       ORDER BY revenue DESC
       LIMIT 6
    `, [userId])

    if (revRows.length > 0) {
      const max = Math.max(...revRows.map(r => +r.revenue), 1)
      return res.json(revRows.map(r => ({
        name: r.name, value: +r.revenue, max, type: 'revenue',
      })))
    }

    // Fall back to listing counts by category
    const { rows: cntRows } = await db.query(`
      SELECT COALESCE(category, 'Other') AS name,
             COUNT(*)                     AS cnt
        FROM ebay_listings
       WHERE user_id = $1 AND category IS NOT NULL
       GROUP BY category
       ORDER BY cnt DESC
       LIMIT 6
    `, [userId])

    const max = Math.max(...cntRows.map(r => +r.cnt), 1)
    res.json(cntRows.map(r => ({
      name: r.name, value: +r.cnt, max, type: 'listings',
    })))
  } catch (err) {
    console.error('[dashboard/categories]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
