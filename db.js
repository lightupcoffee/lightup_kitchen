//db.js
import pg from 'pg'

const { Pool } = pg
console.log(process.env.DATABASE_URL + '?sslmode=require')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL + '?sslmode=require',
})
export const db = pool
