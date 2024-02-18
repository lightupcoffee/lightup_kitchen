export default async function createProduct(req, res) {
  try {
    if (req.method !== 'POST') {
      // 處理非 POST 請求
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const client = await db.connect()
    const product = res.data
    const query = `INSERT INTO lightup."Product"(
          productid, name, description, price, category)
          VALUES (${product.productid}, ${product.name}, ${product.description}, ${product.price}, ${product.category});`
    const result = await client.query(query)
    console.log('createProduct', result)
    // res.status(200).json(result.rows);
    client.release()

    return res.status(200).json({ success: true, data: result.rows })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
