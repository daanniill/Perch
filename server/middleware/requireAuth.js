// Verifies Stack Auth JWTs using the JWKS endpoint derived from NEON_AUTH_URL.
// This approach requires no secret key — the public keys are fetched once and cached.
const { createRemoteJWKSet, jwtVerify } = require('jose')

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.NEON_AUTH_URL}/.well-known/jwks.json`)
)

module.exports = async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { payload } = await jwtVerify(token, JWKS)
    req.user = { id: payload.sub, email: payload.email, name: payload.name }
    next()
  } catch (err) {
    console.error('[requireAuth]', err.message)
    res.status(401).json({ error: 'Unauthorized' })
  }
}
