const express = require('express')
const Groq = require('groq-sdk')
const db = require('../db/client')

const router = express.Router()
let groq
function getGroq() {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return groq
}

// POST /api/generate/listing
router.post('/listing', async (req, res) => {
  try {
    const userId = req.user.id
    const { note, condition = 'Not specified', category = null, styleMatch = true } = req.body

    if (!note?.trim()) {
      return res.status(400).json({ error: 'Item description is required' })
    }

    const [prefsRes, connRes] = await Promise.all([
      db.query('SELECT listing_style FROM onboarding_responses WHERE user_id=$1', [userId]),
      db.query('SELECT store_name FROM ebay_connections WHERE user_id=$1', [userId]),
    ])

    const listingStyle = prefsRes.rows[0]?.listing_style || 'friendly'
    const storeName = connRes.rows[0]?.store_name || 'my store'

    const systemPrompt = `You are an expert eBay listing copywriter${styleMatch ? ` writing for a store called "${storeName}" in a ${listingStyle} tone` : ''}.

Return ONLY valid JSON with exactly these fields — no markdown fences, no extra text:
{
  "title": string (max 80 chars, keyword-rich, no ALL CAPS),
  "description": string (HTML using <p> and <ul>/<li> tags, 2-3 paragraphs${styleMatch ? `, end with a friendly sign-off mentioning "${storeName}"` : ''}),
  "specifics": [{ "key": string, "value": string }] (4-8 pairs relevant to the item),
  "suggestedPrice": number (fair USD market value, no symbol),
  "priceRangeLow": number,
  "priceRangeHigh": number,
  "keywords": string[] (exactly 5 short SEO search phrases),
  "shippingNote": string (e.g. "USPS Priority · ~$9")
}`

    const userMessage = `Item: ${note.trim()}\nCondition: ${condition}${category ? `\nCategory: ${category}` : ''}`

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    })

    const raw = completion.choices[0].message.content.trim()
    let listing
    try {
      listing = JSON.parse(raw)
    } catch {
      // Strip markdown fences if present despite instructions
      const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
      listing = JSON.parse(match ? match[1].trim() : raw)
    }

    res.json({
      title: listing.title,
      description: listing.description,
      specifics: listing.specifics,
      suggestedPrice: listing.suggestedPrice,
      priceRangeLow: listing.priceRangeLow,
      priceRangeHigh: listing.priceRangeHigh,
      keywords: listing.keywords,
      shippingNote: listing.shippingNote,
      styleMatched: styleMatch,
    })
  } catch (err) {
    console.error('[generate/listing]', err.message)
    res.status(500).json({ error: 'Failed to generate listing. Please try again.' })
  }
})

// POST /api/generate/save-draft
router.post('/save-draft', async (req, res) => {
  try {
    const userId = req.user.id
    const {
      note, condition, category, styleMatch,
      title, description, specifics, suggestedPrice,
      priceRangeLow, priceRangeHigh, keywords, shippingNote,
    } = req.body

    const result = await db.query(`
      INSERT INTO generated_listings (
        user_id, input_note, input_condition, input_category, input_style_match,
        title, description, specifics, suggested_price, price_range_low, price_range_high,
        keywords, shipping_note, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'draft')
      RETURNING id
    `, [
      userId, note, condition, category, styleMatch ?? true,
      title, description, JSON.stringify(specifics ?? []),
      suggestedPrice, priceRangeLow, priceRangeHigh,
      keywords, shippingNote,
    ])

    res.json({ id: result.rows[0].id })
  } catch (err) {
    console.error('[generate/save-draft]', err.message)
    res.status(500).json({ error: 'Failed to save draft' })
  }
})

module.exports = router
