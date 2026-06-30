const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

// Without this, a dropped DB connection kills the process
pool.on('error', (err) => console.error('[pg pool error]', err.message))

module.exports = pool
