// pages/api/data.js
import { db } from '../../../db.js'

export default async function getAllCategory(req, res) {
  try {
    const client = await db.connect()
    const result = await client.query('SELECT * FROM lightup."Category" order by categoryid ')
    res.status(200).json(result.rows)
    client.release()
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
