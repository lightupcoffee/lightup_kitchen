import { db } from '../../../db.js'

export default async function editOrderItem(req, res) {
  try {
    if (req.method !== 'POST') {
      // 處理非 POST 請求
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      return // 確保在處理完非POST請求後終止函數執行
    }

    const { order } = req.body
    const client = await db.connect()

    // 使用參數化查詢
    const queryText = `UPDATE lightup."Order"
    SET totalamount=$1, item=$2, discount=$3
    WHERE orderid=$4;`

    const queryParams = [
      order.totalamount,
      JSON.stringify(order.item), // 確保將物件轉為JSON字符串
      order.discount,
      order.orderid,
    ]

    await client.query(queryText, queryParams)

    client.release()

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
