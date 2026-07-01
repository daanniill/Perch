require('dotenv').config()

process.on('uncaughtException', (err) => console.error('[uncaughtException]', err))
process.on('unhandledRejection', (err) => console.error('[unhandledRejection]', err))
const express = require('express')
const cors = require('cors')
const requireAuth = require('./middleware/requireAuth')
const ebay       = require('./routes/ebay')
const user       = require('./routes/user')
const dashboard  = require('./routes/dashboard')
const listings   = require('./routes/listings')
const analytics  = require('./routes/analytics')
const finances   = require('./routes/finances')
const generate   = require('./routes/generate')

const app = express()

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// eBay OAuth callback — no auth middleware (uses signed state JWT)
app.use('/auth/ebay', ebay.auth)

// Protected API routes
app.use('/api/ebay',       requireAuth, ebay.api)
app.use('/api/user',       requireAuth, user)
app.use('/api/dashboard',  requireAuth, dashboard)
app.use('/api/listings',   requireAuth, listings)
app.use('/api/analytics',  requireAuth, analytics)
app.use('/api/finances',   requireAuth, finances)
app.use('/api/generate',  requireAuth, generate)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Perch server → http://localhost:${PORT}`))
