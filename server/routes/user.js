const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const db = require('../db/client')

const router = express.Router()

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

const PREF_DEFAULTS = {
  ai_voice: 'friendly',
  default_condition: 'Pre-owned — Good',
  default_shipping: 'USPS Priority',
  auto_categorize: true,
  suggest_pricing: true,
  notif_sale: true,
  notif_returns: true,
  notif_weekly: true,
  notif_insights: true,
  notif_price: false,
}

const TRIAL_DAYS = 14
const LIMITS = { aiListings: 3, listingsTracked: 25 }

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

// GET /api/user/preferences — Settings: AI voice, listing defaults, notification toggles
router.get('/preferences', async (req, res) => {
  try {
    const userId = req.user.id
    const { rows } = await db.query(`SELECT * FROM user_preferences WHERE user_id=$1`, [userId])
    const prefs = rows[0]

    res.json(prefs ? {
      ai_voice: prefs.ai_voice,
      default_condition: prefs.default_condition,
      default_shipping: prefs.default_shipping,
      auto_categorize: prefs.auto_categorize,
      suggest_pricing: prefs.suggest_pricing,
      notif_sale: prefs.notif_sale,
      notif_returns: prefs.notif_returns,
      notif_weekly: prefs.notif_weekly,
      notif_insights: prefs.notif_insights,
      notif_price: prefs.notif_price,
    } : PREF_DEFAULTS)
  } catch (err) {
    console.error('[user/preferences]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/user/preferences — upsert Settings preferences
router.put('/preferences', async (req, res) => {
  try {
    const userId = req.user.id
    const p = { ...PREF_DEFAULTS, ...req.body }

    await db.query(
      `INSERT INTO user_preferences
         (user_id, ai_voice, default_condition, default_shipping, auto_categorize, suggest_pricing,
          notif_sale, notif_returns, notif_weekly, notif_insights, notif_price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (user_id) DO UPDATE
         SET ai_voice=$2, default_condition=$3, default_shipping=$4, auto_categorize=$5, suggest_pricing=$6,
             notif_sale=$7, notif_returns=$8, notif_weekly=$9, notif_insights=$10, notif_price=$11, updated_at=NOW()`,
      [userId, p.ai_voice, p.default_condition, p.default_shipping, p.auto_categorize, p.suggest_pricing,
       p.notif_sale, p.notif_returns, p.notif_weekly, p.notif_insights, p.notif_price]
    )

    res.json({ ok: true })
  } catch (err) {
    console.error('[user/preferences]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/user/billing — plan, trial countdown, and usage vs. fixed free-tier limits
router.get('/billing', async (req, res) => {
  try {
    const userId = req.user.id

    const [userRes, aiRes, listingRes] = await Promise.all([
      db.query(`SELECT created_at FROM auth.users WHERE id=$1`, [userId]),
      db.query(`SELECT COUNT(*) FROM generated_listings WHERE user_id=$1 AND created_at >= date_trunc('month', now())`, [userId]),
      db.query(`SELECT COUNT(*) FROM ebay_listings WHERE user_id=$1`, [userId]),
    ])

    const createdAt = userRes.rows[0]?.created_at ?? new Date()
    const daysSince = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000)
    const trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSince)

    res.json({
      plan: 'Free',
      trialDaysLeft,
      limits: LIMITS,
      usage: {
        aiListings: Number(aiRes.rows[0].count),
        listingsTracked: Number(listingRes.rows[0].count),
      },
    })
  } catch (err) {
    console.error('[user/billing]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/user/me — deletes the Supabase auth user; all app tables cascade via ON DELETE CASCADE
router.delete('/me', async (req, res) => {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(req.user.id)
    if (error) throw error
    res.json({ ok: true })
  } catch (err) {
    console.error('[user/me delete]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
