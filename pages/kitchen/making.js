import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Dialog from '../components/dialog'
import { useOrders } from '../../context/OrderContext'
import { formatDate } from '../../utils/utils'
import axios from '../../utils/axiosInstance'

// 將不依賴組件狀態的函數移出組件
const getProductRemark = (item, products) => {
  const remark = products.find((x) => x.productid == item[1])?.remark
  return remark ? ` (${remark})` : ''
}

const categorycolor = (item) => {
  const status = item[5]
  if (status == 1) {
    return 'bg-gray-800'
  }

  const categoryid = item[0]
  let color = 'bg-lightblue-600'
  switch (categoryid) {
    case 1:
    case 2:
    case 3:
      color = 'bg-lightblue-600'
      break
    case 4:
      color = 'bg-emerald-500'
      break
    case 5:
      color = 'bg-orange-600'
      break
  }
  return color
}

const Making = () => {
  const [completedOrderDialog, setcompletedOrderDialog] = useState(false)
  const [completedOrderId, setcompletedOrderId] = useState(null)
  const { orders, editOrderItem, editOrder } = useOrders()
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios
      .get('/product/getAllProduct')
      .then((res) => {
        setProducts(res.data)
      })
      .catch((error) => {
        console.error('Failed to fetch getAllProduct:', error)
      })
  }, [])

  const changeItemStatus = useCallback(
    (orderid, productid) => {
      const obj = orders.find((x) => x.orderid === orderid)
      const index = obj.item.findIndex((x) => x[1] === productid)
      if (index !== -1) {
        obj.item[index][5] = obj.item[index][5] === 0 ? 1 : 0
        editOrderItem(obj)
      }
    },
    [orders, editOrderItem],
  )

  // 使用 useMemo 來避免不必要的重新計算
  const activeOrders = useMemo(() => orders.filter((x) => x.status === 1), [orders])

  return (
    <div className=" hide-scrollbar h-full overflow-auto pt-3.5">
      <div className="  flex h-full w-full gap-3.5  ">
        {activeOrders.map((order) => (
          <div key={order.orderid} className="flex  flex-col rounded-lg bg-gray-800 " style={{ minWidth: '375px' }}>
            <div className="p-4">
              <div>
                <span className="c3 rounded-xl bg-white bg-opacity-10 px-2 py-1">
                  # {order.orderid.toString().padStart(6, '0')}
                </span>
              </div>
              <div className="h2 text-center">{order.tableid} 桌</div>
              <div className="c4 text-center text-gray-500">{formatDate(order.createtime, 'yyyy/MM/dd hh:mm')}</div>
            </div>
            <div className="hide-scrollbar flex h-full flex-1 flex-col gap-2.5 overflow-auto border border-y-1 border-gray-900 p-4">
              {order.item.map((x) => (
                <div
                  key={x[2]}
                  onClick={() => {
                    changeItemStatus(order.orderid, x[1])
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded-default p-3    ${x[5] === 0 ? 'bg-gray-700 shadow-lv2' : 'bg-gray-900 text-gray-600'}`}
                >
                  <div className={`h-6 w-4 rounded-sm ${categorycolor(x)}`}></div>
                  <div className="c1">
                    {x[2]} <span className="c3 text-gray-400">{getProductRemark(x, products)}</span>{' '}
                  </div>
                  <div className="c2 text-gray-400">x {x[4]}</div>
                </div>
              ))}
            </div>
            <div className="w-full p-4 shadow-y">
              <div
                className="c1 px-auto w-full cursor-pointer rounded-default bg-orange-500 p-3.5 text-center text-white"
                onClick={() => {
                  setcompletedOrderId(order.orderid)
                  setcompletedOrderDialog(true)
                }}
              >
                <a>訂單完成</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog isOpen={completedOrderDialog} onClose={() => setcompletedOrderDialog(false)}>
        <div className="c2 flex cursor-pointer justify-between rounded-t-default  bg-gray-800 px-6 py-3.5">
          <span>確認完成</span>
          <div className="grid cursor-pointer place-items-center" onClick={() => setcompletedOrderDialog(false)}>
            <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
          </div>
        </div>
        <div className="c1 grid min-h-32 place-items-center p-6 ">
          您是否確認完成訂單
          <span className="text-lightblue-600">#{completedOrderId?.toString().padStart(6, '0')}</span>
        </div>
        <div className="c2 flex w-full gap-2 border-t-1 p-4 ">
          <div
            className="w-full rounded-default bg-gray-800 py-3.5 text-center"
            onClick={() => {
              setcompletedOrderDialog(false)
              setcompletedOrderId(null)
            }}
          >
            取消
          </div>
          <div
            className="w-full cursor-pointer  rounded-default bg-orange-500 py-3.5 text-center "
            onClick={() => {
              editOrder(completedOrderId, [{ column: 'status', value: 2 }]).then(() => {
                setcompletedOrderDialog(false)
              })
            }}
          >
            確認
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default Making
