import { db } from '../../../db.js'

export default async function editOrder(req, res) {
  try {
    if (req.method !== 'POST') {
      // 处理非 POST 请求
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const client = await db.connect()
    const { id, data } = req.body

    const updates = data.map((x, index) => `"${x.column}"=$${index + 1}`)
    const values = data.map((x) => x.value)

    values.push(id)

    const queryText = `UPDATE lightup."Order" SET ${updates.join(', ')} WHERE orderid=$${updates.length + 1};`

    await client.query(queryText, values)

    client.release()

    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
