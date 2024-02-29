// pages/api/data.js
import { db } from '../../../db.js'
import { formatDate } from '../../../utils/utils.js'
import ExcelJS from 'exceljs'
export default async function getAllOrderReportFile(req, res) {
  try {
    const client = await db.connect()
    const result = await client.query(
      'SELECT * FROM lightup."Order" where createtime::date = CURRENT_DATE order by createtime  ',
    )
    const data = result.rows
    client.release()

    const today = new Date()
    const dateString = formatDate(today, 'yyyyMMdd')

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('訂單列表_' + dateString)

    // 添加列标题
    sheet.columns = [
      { header: '接單時間', key: 'createtime', width: 10 },
      { header: '桌號', key: 'tableid', width: 10 },
      { header: '付款方式', key: 'paymenttype', width: 20 },
      { header: '訂單內容', key: 'item', width: 80 },
      { header: '訂單總金額', key: 'totalamount', width: 15 },
    ]

    data.forEach((x) => {
      sheet.addRow({
        createtime: switchtimezoom(x.createtime, {
          hour: '2-digit',
          minute: '2-digit',
        }),
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
    // 設置響應頭部

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
  }
}

function switchtimezoom(dateInput, formatOptions = {}, timeZone = 'Asia/Taipei') {
  const formatter = new Intl.DateTimeFormat('zh-TW', {
    ...formatOptions,
    timeZone,
    hour12: false,
  })
  return formatter.format(new Date(dateInput))
}
