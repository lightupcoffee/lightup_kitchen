import { useOrders } from '../../context/OrderContext'
const Making = ({}) => {
  const { orders, updateOrder, updateOrderStatus } = useOrders()
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
  const formatDate = (dateString) => {
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

  const changeItemStatus = (orderid, productid) => {
    const obj = orders.find((x) => x.orderid === orderid)
    const index = obj.item.findIndex((x) => x[1] === productid)
    if (index == -1) {
      return
    }
    obj.item[index][5] = obj.item[index][5] === 0 ? 1 : 0
    updateOrder(obj)
  }

  return (
    <div className=" h-full px-6 pt-3.5">
      <div className=" hide-scrollbar flex h-full w-full gap-3.5 overflow-x-auto ">
        {orders
          .filter((x) => x.status === 1)
          .map((order) => (
            <div
              key={order.orderid}
              className="flex  flex-col rounded-default bg-gray-800 "
              style={{ minWidth: '375px' }}
            >
              <div className="p-4">
                <div>
                  <span className="c3 rounded-lg bg-white bg-opacity-10 px-2 py-1">
                    # {order.orderid.toString().padStart(6, '0')}
                  </span>
                </div>
                <div className="h2 text-center">{order.tableid} 桌</div>
                <div className="c4 text-center text-gray-500">{formatDate(order.createtime)}</div>
              </div>
              <div className="hide-scrollbar flex h-full flex-1 flex-col gap-2.5 overflow-auto border border-y-1 border-gray-900 p-4">
                {order.item.map((x) => (
                  <div
                    key={x[2]}
                    onClick={() => {
                      changeItemStatus(order.orderid, x[1])
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-sm p-3   shadow-lv2 ${x[5] === 0 ? 'bg-gray-600' : 'bg-gray-900 text-gray-600'}`}
                  >
                    <div className={`h-6 w-4 rounded-[0.375rem] ${categorycolor(x)}`}></div>
                    <div className="c1">{x[2]}</div>
                    <div className="c2">x {x[4]}</div>
                  </div>
                ))}
              </div>
              <div className="w-full p-4 shadow-y">
                <div
                  className="c1 px-auto w-full rounded-sm bg-orange-500 p-3.5 text-center text-white"
                  onClick={() => {
                    updateOrderStatus(order.orderid, 2)
                  }}
                >
                  <a>訂單完成</a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Making