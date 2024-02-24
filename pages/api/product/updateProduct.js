import { db } from '../../../db.js'
export default async function updateProduct(req, res) {
  try {
    if (req.method !== 'POST') {
      // 處理非 POST 請求
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const client = await db.connect()

    const { id, data } = req.body
    console.log('indata', data)
    const updatequery = data.map((x) => {
      return `${x.column}=${x.value}`
    })
    await client.query(`UPDATE lightup."Product" SET ${updatequery.join(',')} WHERE productid=${id} ; `)

    client.release()

    return res.status(200).json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
