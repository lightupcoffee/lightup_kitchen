//db.js
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL + '?sslmode=require',
})
export const db = pool
