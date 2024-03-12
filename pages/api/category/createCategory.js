import { db } from '../../../db.js'

export default async function createCategory(req, res) {
  try {
    if (req.method !== 'POST') {
      // 處理非 POST 請求
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const client = await db.connect()
    const category = req.body

    const queryText = `INSERT INTO lightup."Category" (
      name,  sort
    ) VALUES ($1, $2);`

    const values = [category.name, category.sort]

    await client.query(queryText, values)

    client.release()

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
