const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

module.exports = async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return res.status(401).json({ error: 'Unauthorized' })

    req.user = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name ?? user.email,
    }
    next()
  } catch (err) {
    console.error('[requireAuth]', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}
