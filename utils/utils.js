export function formatDate(dateString) {
  if (!dateString) return ''
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }
  return new Date(dateString).toLocaleString('zh-TW', options).replace(/\//g, '-').replace(/, /g, ' ')
}

export function formatCurrency(value) {
  // 創建一個新的Intl.NumberFormat實例
  const formatter = new Intl.NumberFormat('zh-TW', {
    style: 'decimal', // 使用小數格式
    maximumFractionDigits: 0, // 不顯示小數部分
  })

  // 使用formatter格式化數字
  return formatter.format(value)
}
