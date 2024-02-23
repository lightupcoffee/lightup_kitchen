import { db } from '../../../db.js'
export default async function updateOrder(req, res) {
  try {
    if (req.method !== 'POST') {
      // 處理非 POST 請求
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const client = await db.connect()

    const { orderId, data } = req.body

    const updatequery = data.map((x, index) => {
      console.log('x', x)
      return `${x.column}=${x.value}`
    })
    console.log('updatequery', updatequery.join(','))
    await client.query(`UPDATE lightup."Order" SET ${updatequery.join(',')} WHERE orderid=${orderId} ; `)

    client.release()

    return res.status(200).json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
