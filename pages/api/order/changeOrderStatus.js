import { db } from '../../../db.js'
export default async function updateOrderbyId(req, res) {
  try {
    if (req.method !== 'POST') {
      // 處理非 POST 請求
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const client = await db.connect()

    const { orderId, status } = req.body

    await client.query(`UPDATE lightup."Order" SET status=${status} WHERE orderid=${orderId} ; `)

    client.release()

    return res.status(200).json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
