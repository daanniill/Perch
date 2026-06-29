require('dotenv').config()
const express = require('express')
const cors = require('cors')
const requireAuth = require('./middleware/requireAuth')
const ebay = require('./routes/ebay')
const user = require('./routes/user')

const app = express()

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// eBay OAuth callback — no auth middleware (uses signed state JWT)
app.use('/auth/ebay', ebay.auth)

// Protected API routes
app.use('/api/ebay', requireAuth, ebay.api)
app.use('/api/user', requireAuth, user)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Perch server → http://localhost:${PORT}`))
