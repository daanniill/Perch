const express = require('express')
const db = require('../db/client')

const router = express.Router()

const PERIOD = {
  '7d':  { since: `NOW() - INTERVAL '7 days'`,   trunc: 'day',   fmt: 'Dy'     },
  '30d': { since: `NOW() - INTERVAL '30 days'`,  trunc: 'week',  fmt: 'Mon DD' },
  '90d': { since: `NOW() - INTERVAL '90 days'`,  trunc: 'month', fmt: 'Mon'    },
  '12mo':{ since: `NOW() - INTERVAL '12 months'`,trunc: 'month', fmt: 'Mon'    },
}

// GET /api/analytics/summary?period=30d
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id
    const p = PERIOD[req.query.period] ?? PERIOD['30d']

    const [orderRes, catRes, topRes] = await Promise.all([
      db.query(`
        SELECT COUNT(*)                          AS orders,
               COALESCE(SUM(total_amount), 0)    AS revenue,
               COALESCE(AVG(total_amount), 0)    AS aov
          FROM ebay_orders
         WHERE user_id = $1 AND status NOT IN ('CANCELLED')
           AND ordered_at >= ${p.since}
      `, [userId]),
      db.query(`
        SELECT COALESCE(category, 'Other')  AS name,
               COUNT(*)                      AS listing_count,
               COALESCE(SUM(quantity_sold), 0) AS sold
          FROM ebay_listings
         WHERE user_id = $1 AND category IS NOT NULL
         GROUP BY category
         ORDER BY listing_count DESC
         LIMIT 6
      `, [userId]),
      db.query(`
        SELECT title, category, price
          FROM ebay_listings
         WHERE user_id = $1
         ORDER BY price DESC NULLS LAST
         LIMIT 5
      `, [userId]),
    ])

    const o = orderRes.rows[0]
    res.json({
      orders:  +o.orders,
      revenue: +o.revenue,
      aov:     +o.aov,
      categories: catRes.rows.map(r => ({
        name:          r.name,
        listing_count: +r.listing_count,
        sold:          +r.sold,
      })),
      top_listings: topRes.rows.map(r => ({
        title:    r.title,
        category: r.category,
        price:    r.price != null ? +r.price : null,
      })),
    })
  } catch (err) {
    console.error('[analytics/summary]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/analytics/chart?period=30d
router.get('/chart', async (req, res) => {
  try {
    const userId = req.user.id
    const p = PERIOD[req.query.period] ?? PERIOD['30d']

    const { rows } = await db.query(`
      SELECT DATE_TRUNC($1, ordered_at)               AS bucket,
             TO_CHAR(DATE_TRUNC($1, ordered_at), $2)  AS label,
             COUNT(*)                                   AS orders
        FROM ebay_orders
       WHERE user_id = $3 AND status NOT IN ('CANCELLED')
         AND ordered_at >= ${p.since}
       GROUP BY bucket
       ORDER BY bucket
    `, [p.trunc, p.fmt, userId])

    res.json({
      labels: rows.map(r => r.label),
      orders: rows.map(r => +r.orders),
    })
  } catch (err) {
    console.error('[analytics/chart]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
