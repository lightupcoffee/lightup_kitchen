export default async function getArticle(req, res) {
  try {
    const client = await db.connect()
    const id = res.data
    const result = await client.query(`SELECT * FROM lightup."Product" where ProductId=${id}`)
    res.status(200).json(result.rows)
    client.release()
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
