import { db } from '../../../db.js'
export default async function updateProductSort(req, res) {
  try {
    if (req.method !== 'POST') {
      // 處理非 POST 請求
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const client = await db.connect()

    const { data } = req.body

    let caseStatement = 'CASE'
    const ids = data.map(({ id }) => id)
    data.forEach(({ id, sort }) => {
      caseStatement += ` WHEN productid = ${id} THEN ${sort}`
    })
    caseStatement += ' ELSE sort END'

    const updateQuery = `
      UPDATE lightup."Product"
      SET sort = ${caseStatement}
      WHERE productid IN (${ids.join(', ')});
    `
    await client.query(updateQuery)
    client.release()

    return res.status(200).json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
