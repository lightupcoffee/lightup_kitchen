import React, { useState, useEffect } from 'react'
import Uncheck from './uncheck'
import Making from './making'
import { formatCurrency, formatDate } from '../../utils/utils'
import { useOrders } from '../../context/OrderContext'
const Kitchen = () => {
  const { orders } = useOrders()

  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const formattedDateTime = formatDate(now, 'yyyy/MM/dd hh:mm:ss (W)')
      setCurrentTime(formattedDateTime)
    }
    updateDateTime()
    const timerId = setInterval(updateDateTime, 1000)

    // 清理定時器
    return () => clearInterval(timerId)
  }, [])

  const [totalAmount, settotalAmount] = useState(0)
  useEffect(() => {
    const total = orders.reduce((a, b) => a + b.totalamount, 0)
    settotalAmount(total)
  }, [orders])

  const tablist = { 0: '未結帳', 1: '製作中' }
  const [currentTab, setcurrentTab] = useState(0)

  return (
    <div className="flex h-full flex-col px-8 py-9">
      <div className=" border-b-2 border-gray-700 ">
        <div className="flex justify-between">
          <div className="h3"> 排隊訂單</div>
          <div className="c4 text-end text-gray-500">
            <p>{currentTime || '加載中...'}</p>
            <p>目前總計: NTS {formatCurrency(totalAmount)}</p>
          </div>
        </div>
        <div className="flex gap-8">
          {Object.entries(tablist).map(([id, title]) => (
            <div
              key={id}
              className={`c2 flex cursor-pointer items-center gap-2 border-b-4 pb-1.5 ${currentTab == id ? 'border-orange-500 text-white' : 'border-transparent text-gray-500'}`}
              onClick={() => setcurrentTab(id)}
            >
              {title}
              <span
                className={`c4 round-full rounded-full px-1 py-0.5 text-white ${currentTab == id ? 'bg-orange-500' : 'bg-gray-700'}`}
              >
                {orders.filter((x) => x.status == id).length}
              </span>
            </div>
          ))}
        </div>
      </div>
      {currentTab == 0 && <Uncheck></Uncheck>}
      {currentTab == 1 && <Making></Making>}
    </div>
  )
}
// export async function getStaticProps() {
//   let categorys = []
//   let products = []
//   await axios
//     .get('/category/getAllCategory')
//     .then((res) => {
//       categorys = res.data
//     })
//     .catch((error) => {
//       console.error('Failed to fetch data:', error)
//     })
//   await axios
//     .get('/product/getAllProduct')
//     .then((res) => {
//       products = res.data
//     })
//     .catch((error) => {
//       console.error('Failed to fetch getAllProduct:', error)
//     })
//   return {
//     props: {
//       categorys: categorys,
//       products: products,
//     },
//     revalidate: 10, // In seconds (optional, for incremental static regeneration)
//   }
// }

export default Kitchen
