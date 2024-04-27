// pages/api/data.js
import { db } from '../../../db.js'
import { formatDate } from '../../../utils/utils.js'
import ExcelJS from 'exceljs'
export default async function getAllOrderReportFile(req, res) {
  const client = await db.connect()
  try {
    const query1 = await client.query(
      'SELECT * FROM lightup."Order" where createtime::date = CURRENT_DATE order by createtime ',
    )
    const orders = query1.rows
    const query2 = await client.query('SELECT * FROM lightup."Product"  order by  categoryid ,sort ')
    const products = query2.rows

    client.release()

    const today = new Date()
    const dateString = formatDate(today, 'yyyyMMdd')

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('訂單列表_' + dateString)

    // 添加列标题
    sheet.columns = [
      { header: '接單時間', key: 'createtime', width: 10 },
      { header: '結帳時間', key: 'paymenttime', width: 10 },
      { header: '完成時間', key: 'completedtime', width: 10 },
      { header: '桌號', key: 'tableid', width: 10 },
      { header: '付款方式', key: 'paymenttype', width: 20 },
      { header: '訂單內容', key: 'item', width: 80 },
      { header: '訂單總金額', key: 'totalamount', width: 15 },
    ]

    orders.forEach((x) => {
      sheet.addRow({
        createtime: switchtimezoom(x.createtime, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        paymenttime: switchtimezoom(x.paymenttime, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        completedtime: x.completedtime
          ? switchtimezoom(x.completedtime, {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          : '',
        tableid: x.tableid,
        paymenttype: x.paymenttype,
        item: JSON.parse(x.item)
          .map((i) => {
            return `${i[2]} $${i[3]}*${i[4]}`
          })
          .join(' / '),
        totalamount: x.totalamount,
      })
    })

    const sheet2 = workbook.addWorksheet('品項列表_' + dateString)
    sheet2.columns = [
      { header: '品項', key: 'item', width: 20 },
      { header: '單價', key: 'price', width: 10 },
      { header: '數量', key: 'quantity', width: 10 },
      { header: '總金額', key: 'totalamount', width: 10 },
    ]
    const itemSummary = {}
    orders.forEach((order) => {
      const items = JSON.parse(order.item)
      items.forEach((item) => {
        const [categoryid, productid, name, price, quantity, ready] = item
        if (!itemSummary[name]) {
          itemSummary[name] = { name, price, quantity: 0 }
        }
        itemSummary[name].quantity += quantity
      })
    })

    products.forEach((product) => {
      const summary = itemSummary[product.name]
      if (summary) {
        sheet2.addRow({
          item: summary.name,
          price: `$${summary.price}`,
          quantity: summary.quantity,
          totalamount: summary.price * summary.quantity,
        })
      }
    })

    const filename = `訂單_${dateString}.xlsx`
    const encodedFilename = encodeURIComponent(filename)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`)
    await workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        res.send(buffer)
      })
      .catch((error) => {
        console.error(error)
        res.status(500).json({ error: 'Failed to generate Excel file' })
      })
    // res.status(200).json(result.rows)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
}

function switchtimezoom(dateInput, formatOptions = {}, timeZone = 'Asia/Taipei') {
  if (!dateInput) {
    return ''
  }
  const formatter = new Intl.DateTimeFormat('zh-TW', {
    ...formatOptions,
    timeZone,
    hour12: false,
  })
  return formatter.format(new Date(dateInput))
}
