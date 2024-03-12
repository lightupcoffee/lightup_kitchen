import { db } from '../../../db.js'

export default async function createProduct(req, res) {
  try {
    if (req.method !== 'POST') {
      // 處理非 POST 請求
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const client = await db.connect()
    const product = req.body

    const queryText = `INSERT INTO lightup."Product" (
      name, description, price, categoryid, active, sort, remark
    ) VALUES ($1, $2, $3, $4, $5, $6, $7);`

    const values = [
      product.name,
      product.description,
      product.price,
      product.categoryid,
      product.active,
      product.sort,
      product.remark,
    ]

    const result = await client.query(queryText, values)

    client.release()

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
