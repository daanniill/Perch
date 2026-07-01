const express = require('express')
const db = require('../db/client')

const router = express.Router()

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// GET /api/finances/summary?year=2026
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id
    const year   = parseInt(req.query.year) || new Date().getFullYear()

    if (year < 2020 || year > 2030) return res.status(400).json({ error: 'Invalid year' })

    const { rows } = await db.query(`
      SELECT EXTRACT(MONTH FROM ordered_at)       AS month,
             COALESCE(SUM(total_amount), 0)        AS rev,
             COALESCE(SUM(ebay_fees), 0)           AS fees,
             COALESCE(SUM(shipping_cost), 0)       AS ship
        FROM ebay_orders
       WHERE user_id = $1
         AND status NOT IN ('CANCELLED')
         AND EXTRACT(YEAR FROM ordered_at) = $2
       GROUP BY month
       ORDER BY month
    `, [userId, year])

    // Build 12-entry array (months with no orders stay at 0)
    const byMonth = Array.from({ length: 12 }, () => ({ rev: 0, fees: 0, ship: 0 }))
    for (const r of rows) {
      byMonth[+r.month - 1] = { rev: +r.rev, fees: +r.fees, ship: +r.ship }
    }

    const months = byMonth.map((m, i) => {
      const gp = m.rev - m.fees - m.ship
      return {
        label:        MONTHS[i],
        revenue:      m.rev,
        fees:         m.fees,
        shipping:     m.ship,
        gross_profit: Math.max(0, gp),
        margin:       m.rev > 0 ? (gp / m.rev * 100).toFixed(0) : null,
      }
    })

    const totRev  = months.reduce((s, m) => s + m.revenue, 0)
    const totFees = months.reduce((s, m) => s + m.fees, 0)
    const totShip = months.reduce((s, m) => s + m.shipping, 0)
    const totGp   = totRev - totFees - totShip

    res.json({
      year,
      yearly: {
        revenue:      totRev,
        fees:         totFees,
        shipping:     totShip,
        gross_profit: Math.max(0, totGp),
        gross_margin: totRev > 0 ? totGp / totRev * 100 : 0,
        fees_pct:     totRev > 0 ? totFees / totRev * 100 : 0,
        shipping_pct: totRev > 0 ? totShip / totRev * 100 : 0,
        profit_pct:   totRev > 0 ? Math.max(0, totGp) / totRev * 100 : 0,
      },
      months,
    })
  } catch (err) {
    console.error('[finances/summary]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
