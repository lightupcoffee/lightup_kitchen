export default async function createProduct(req, res) {
  try {
    if (req.method !== 'POST') {
      // 處理非 POST 請求
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const client = await db.connect()
    const product = req.body
    const query = `INSERT INTO lightup."Product"(
          productid, name, description, price, categoryid,active,sort)
          VALUES (${product.productid}, '${product.name}', '${product.description}', ${product.price}, ${product.categoryid},${product.active},${product.sort});`
    const result = await client.query(query)

    client.release()

    return res.status(200).json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
