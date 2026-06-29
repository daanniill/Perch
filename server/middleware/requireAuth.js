// Verifies a Stack Auth access token by calling Stack Auth's server API.
// The client sends: Authorization: Bearer <access_token>
// Docs: https://docs.stack-auth.com/rest-api/server/user#get-apiv1usersme
const STACK_API = 'https://api.stack-auth.com'

module.exports = async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const r = await fetch(`${STACK_API}/api/v1/users/me`, {
      headers: {
        'x-stack-access-type': 'server',
        'x-stack-project-id': process.env.STACK_PROJECT_ID,
        'x-stack-secret-server-key': process.env.STACK_SECRET_SERVER_KEY,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!r.ok) return res.status(401).json({ error: 'Unauthorized' })

    const user = await r.json()
    req.user = { id: user.id, email: user.primary_email, name: user.display_name }
    next()
  } catch (err) {
    console.error('[requireAuth]', err.message)
    res.status(500).json({ error: 'Auth verification failed' })
  }
}
