/**
 * 格式化日期字符串或日期對象為指定的格式。
 *
 * @param {Date|string} input 日期對象或可被 `Date` 構造函數解析的日期字符串。
 * @param {string} fmt 格式化模板字符串，其中年(`y`)、月(`M`)、日(`d`)、小時(`h`)、分鐘(`m`)、秒(`s`)、毫秒(`S`)和季度(`q`)可以被特定的模式替換。
 *                      特殊標記 `(W)` 會被替換為星期幾（`日`, `一`, `二`, `三`, `四`, `五`, `六`）。
 *                      示例：`"yyyy-MM-dd hh:mm:ss (W)"` 可以格式化為 `"2023-03-28 08:30:25 (二)"`。
 * @returns {string} 格式化後的日期字符串。如果輸入不是有效的日期或日期字符串，將返回空字符串。
 */
export function formatDate(input, fmt) {
  let date = input

  // 檢查輸入是否為字符串，如果是，嘗試轉換為Date對象
  if (typeof input === 'string') {
    date = new Date(input)
  }

  // 如果輸入不是Date對象或轉換失敗，返回空字符串
  if (!(date instanceof Date) || isNaN(date)) {
    return ''
  }

  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小時
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  }

  // 处理年份
  fmt = fmt.replace(/(y+)/g, (match) => {
    return (date.getFullYear() + '').slice(4 - match.length)
  })

  // 处理其他时间单位
  Object.keys(o).forEach((k) => {
    fmt = fmt.replace(new RegExp('(' + k + ')', 'g'), (match) => {
      return match.length === 1 ? o[k] : ('00' + o[k]).slice(-2)
    })
  })

  // 檢查格式字符串中是否含有 (W)，如果有，則替換為星期
  if (fmt.includes('(W)')) {
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    fmt = fmt.replace('(W)', `(${weekDay})`)
  }

  return fmt
}

/**
 * 格式化數值為貨幣格式。
 *
 * @param {number} value 需要格式化的數值。
 * @returns {string} 格式化後的字符串，以繁體中文的小數格式表示，並且不包括小數部分。
 */
export function formatCurrency(value) {
  const formatter = new Intl.NumberFormat('zh-TW', {
    style: 'decimal', // 使用小數格式
    maximumFractionDigits: 0, // 不顯示小數部分
  })

  // 使用formatter格式化數字
  return formatter.format(value)
}
