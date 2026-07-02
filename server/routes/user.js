const express = require('express')
const db = require('../db/client')

const router = express.Router()

// GET /api/user/me — returns auth state + onboarding/eBay status
router.get('/me', async (req, res) => {
  try {
    const userId = req.user.id

    const [onboardingRes, ebayRes] = await Promise.all([
      db.query(`SELECT * FROM onboarding_responses WHERE user_id=$1`, [userId]),
      db.query(`SELECT store_name, last_synced_at FROM ebay_connections WHERE user_id=$1`, [userId]),
    ])

    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      onboardingComplete: !!onboardingRes.rows[0],
      ebayConnected: !!ebayRes.rows[0],
      storeName: ebayRes.rows[0]?.store_name ?? null,
    })
  } catch (err) {
    console.error('[user/me]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/user/onboarding — saves Q&A preferences, marks onboarding complete
router.post('/onboarding', async (req, res) => {
  try {
    const userId = req.user.id
    const { categories, listing_style, monthly_goal, experience_level, primary_goal } = req.body

    await db.query(
      `INSERT INTO onboarding_responses (user_id, categories, listing_style, monthly_goal, experience_level, primary_goal)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (user_id) DO UPDATE
         SET categories=$2, listing_style=$3, monthly_goal=$4, experience_level=$5, primary_goal=$6, completed_at=NOW()`,
      [userId, categories ?? [], listing_style, monthly_goal, experience_level, primary_goal]
    )

    res.json({ ok: true })
  } catch (err) {
    console.error('[user/onboarding]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
