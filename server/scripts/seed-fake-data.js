// Seed fake listings + orders for all users in the DB
// Usage: node server/scripts/seed-fake-data.js
// Run from project root so .env is picked up via dotenv

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const db = require('../db/client')

// ── fake listing catalogue ────────────────────────────────────────────────────

const LISTING_TEMPLATES = [
  { title: 'Nike Air Max 90 Sneakers Size 10', category: 'Shoes', price: 89.99,  status: 'active',  image_url: null },
  { title: 'Vintage Levi\'s 501 Jeans 32x30',  category: 'Jeans',  price: 45.00,  status: 'active',  image_url: null },
  { title: 'Apple iPhone 12 Pro 256GB Unlocked', category: 'Phones', price: 449.99, status: 'active',  image_url: null },
  { title: 'Sony WH-1000XM4 Wireless Headphones', category: 'Electronics', price: 189.50, status: 'active', image_url: null },
  { title: 'The North Face Fleece Jacket Men L', category: 'Jackets', price: 65.00,  status: 'active',  image_url: null },
  { title: 'Adidas Ultraboost 22 Size 9', category: 'Shoes', price: 74.00,  status: 'sold',    image_url: null },
  { title: 'Coach Leather Handbag Tan', category: 'Bags', price: 120.00, status: 'sold',    image_url: null },
  { title: 'Vintage Band Tee Rolling Stones XL', category: 'Tops',  price: 32.00,  status: 'sold',    image_url: null },
  { title: 'Patagonia Down Sweater Hoodie S',  category: 'Jackets', price: 95.00,  status: 'active',  image_url: null },
  { title: 'Jordan 1 Retro High OG Size 11',  category: 'Shoes',  price: 210.00, status: 'active',  image_url: null },
  { title: 'Ray-Ban Wayfarer Sunglasses Black', category: 'Accessories', price: 55.00, status: 'active', image_url: null },
  { title: 'Lululemon Align Leggings Size 6', category: 'Bottoms', price: 58.00,  status: 'sold',    image_url: null },
  { title: 'Canon EOS M50 Mirrorless Camera', category: 'Cameras', price: 299.00, status: 'active',  image_url: null },
  { title: 'Supreme Box Logo Hoodie Blue M', category: 'Tops',   price: 245.00, status: 'active',  image_url: null },
  { title: 'Vintage Polaroid OneStep Camera', category: 'Cameras', price: 39.99,  status: 'unsold',  image_url: null },
  { title: 'Tommy Hilfiger Polo Shirt White L', category: 'Tops',  price: 28.00,  status: 'active',  image_url: null },
  { title: 'Beats Studio3 Wireless Headphones', category: 'Electronics', price: 135.00, status: 'sold', image_url: null },
  { title: 'Carhartt WIP Work Pants 34x32', category: 'Bottoms', price: 52.00,  status: 'active',  image_url: null },
  { title: 'Hydro Flask 32oz Wide Mouth Bottle', category: 'Accessories', price: 24.00, status: 'active', image_url: null },
  { title: 'Vans Old Skool Black White Size 8', category: 'Shoes', price: 44.00,  status: 'draft',   image_url: null },
]

// ── fake order generator ──────────────────────────────────────────────────────

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1))
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function buildOrders(userId, listings) {
  const sold = listings.filter(l => l.status === 'sold')
  const orders = []

  // spread orders over the past 12 months
  for (let i = 0; i < 40; i++) {
    const listing = sold.length > 0
      ? sold[i % sold.length]
      : listings[i % listings.length]

    const dayOffset  = randomInt(0, 365)
    const revenue    = listing.price * randomBetween(0.85, 1.10)
    const fees       = revenue * randomBetween(0.10, 0.14)
    const shipping   = randomBetween(4.5, 12.0)

    orders.push({
      user_id:       userId,
      ebay_order_id: `FAKE-ORDER-${userId.slice(0, 8)}-${i}`,
      total_amount:  revenue.toFixed(2),
      currency:      'USD',
      status:        'FULFILLED',
      buyer_username:`buyer${randomInt(1000, 9999)}`,
      item_count:    1,
      shipping_cost: shipping.toFixed(2),
      ebay_fees:     fees.toFixed(2),
      ordered_at:    daysAgo(dayOffset),
      item_title:    listing.title,
      item_sku:      listing.sku,
    })
  }

  // add a cluster in the past 30 days for better chart shape
  for (let i = 0; i < 15; i++) {
    const listing  = listings[i % listings.length]
    const dayOffset = randomInt(0, 30)
    const revenue   = listing.price * randomBetween(0.88, 1.05)
    const fees      = revenue * randomBetween(0.10, 0.14)
    const shipping  = randomBetween(4.5, 12.0)

    orders.push({
      user_id:       userId,
      ebay_order_id: `FAKE-RECENT-${userId.slice(0, 8)}-${i}`,
      total_amount:  revenue.toFixed(2),
      currency:      'USD',
      status:        'FULFILLED',
      buyer_username:`buyer${randomInt(1000, 9999)}`,
      item_count:    1,
      shipping_cost: shipping.toFixed(2),
      ebay_fees:     fees.toFixed(2),
      ordered_at:    daysAgo(dayOffset),
      item_title:    listing.title,
      item_sku:      listing.sku,
    })
  }

  return orders
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Get all user IDs from ebay_connections or any user-keyed table
  const { rows: userRows } = await db.query(
    `SELECT DISTINCT user_id FROM ebay_connections
     UNION
     SELECT DISTINCT user_id FROM ebay_listings
     UNION
     SELECT DISTINCT user_id FROM ebay_orders`
  )

  // If no users found at all, try the auth schema
  let userIds = userRows.map(r => r.user_id)
  if (userIds.length === 0) {
    const { rows } = await db.query(`SELECT id FROM auth.users LIMIT 10`)
    userIds = rows.map(r => r.id)
  }

  if (userIds.length === 0) {
    console.error('No users found in DB. Log in once via the app first.')
    process.exit(1)
  }

  console.log(`Seeding data for ${userIds.length} user(s): ${userIds.join(', ')}`)

  for (const userId of userIds) {
    console.log(`\n── User ${userId} ──`)

    // Insert listings
    const insertedListings = []
    for (let i = 0; i < LISTING_TEMPLATES.length; i++) {
      const t   = LISTING_TEMPLATES[i]
      const sku = `FAKE-SKU-${userId.slice(0, 8)}-${i}`
      const listedAt = daysAgo(randomInt(10, 200))

      await db.query(
        `INSERT INTO ebay_listings
           (user_id, ebay_item_id, title, category, price, status, quantity, listed_at, synced_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
         ON CONFLICT (user_id, ebay_item_id) DO UPDATE
           SET title=$3, category=$4, price=$5, status=$6, quantity=$7, listed_at=$8, synced_at=NOW()`,
        [userId, sku, t.title, t.category, t.price, t.status,
         t.status === 'active' ? randomInt(1, 3) : 0, listedAt]
      )
      insertedListings.push({ ...t, sku })
    }
    console.log(`  ✓ ${LISTING_TEMPLATES.length} listings upserted`)

    // Insert orders
    const orders = buildOrders(userId, insertedListings)
    for (const o of orders) {
      await db.query(
        `INSERT INTO ebay_orders
           (user_id, ebay_order_id, total_amount, currency, status, buyer_username,
            item_count, shipping_cost, ebay_fees, ordered_at, item_title, item_sku, synced_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW())
         ON CONFLICT (user_id, ebay_order_id) DO NOTHING`,
        [o.user_id, o.ebay_order_id, o.total_amount, o.currency, o.status,
         o.buyer_username, o.item_count, o.shipping_cost, o.ebay_fees,
         o.ordered_at, o.item_title, o.item_sku]
      )
    }
    console.log(`  ✓ ${orders.length} orders inserted`)
  }

  console.log('\nDone! Refresh the app to see data.')
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
