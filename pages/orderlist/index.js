import React from 'react'
import Image from 'next/image'
import axios from '../../utils/axiosInstance'
import { formatCurrency, formatDate } from '../../utils/utils'
import { useOrders } from '../../context/OrderContext'
import { useState, useEffect } from 'react'
import Dialog from '../components/dialog'
const OrderList = () => {
  const [orderdetailDialog, setorderdetailDialog] = useState(false)
  const [orderdetailobj, setorderdetailobj] = useState(null)
  const [removeOrderDialog, setRemoveOrderDialog] = useState(false)
  const { orders, updateOrderList } = useOrders()
  const paymenttypeColor = (type) => {
    switch (type) {
      case '現金付款':
        return 'bg-orange-500/10 text-orange-500'
      case 'Line Pay':
        return 'bg-emerald-500/10 text-emerald-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }
  const openOrderDetail = (order) => {
    setorderdetailobj(order)
    setorderdetailDialog(true)
  }
  const closeOrderDetail = () => {
    setorderdetailobj(null)
    setorderdetailDialog(false)
  }

  const getOrderReportFile = () => {
    axios({
      url: '/order/getAllOrderReportFile', // API 的路徑
      method: 'GET', // 或 'POST'，取決於你的實現
      responseType: 'blob', // 重要：指示預期的響應數據類型為 Blob
    })
      .then((response) => {
        // 創建一個 URL 並將其設置為 a 標簽的 href 屬性，然後模擬點擊來下載
        const today = new Date()
        const dateString = formatDate(today, 'yyyyMMdd')

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `訂單_${dateString}.xlsx`) // 指定下載的文件名
        document.body.appendChild(link)
        link.click()

        // 下載後清理並釋放 URL 對象
        link.parentNode.removeChild(link)
        window.URL.revokeObjectURL(url)
        setRemoveOrderDialog(true)
      })
      .catch((error) => console.error('Download error:', error))
  }

  const removeOrder = () => {
    axios({
      method: 'post',
      url: '/order/deleteAllOrder',
    })
      .then(async (res) => {
        await updateOrderList()
        setRemoveOrderDialog(false)
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
  }
  return (
    <div className="flex h-full flex-col px-8 py-9">
      <div className="flex h-full flex-col ">
        <div className="mb-3 flex items-center gap-2">
          <div className="h3"> 訂單記錄</div>
          <div
            onClick={() => setRemoveOrderDialog(true)}
            className=" flex cursor-pointer items-center rounded-sm border-2 border-gray-700 px-1 py-1 text-gray-200"
          >
            <Image className="mx-auto" src={`/images/36x/Hero/trash.svg`} alt="trash" width={18} height={18} />
          </div>
          <div
            onClick={getOrderReportFile}
            className="c2 ml-auto flex cursor-pointer items-center gap-1 rounded-sm border-2 border-gray-700 px-3 py-1 text-gray-200"
          >
            <Image
              className="mx-auto"
              src={`/images/36x/Hero/arrow-down-tray.svg`}
              alt="arrow-down-tray"
              width={18}
              height={18}
            />
            下載
          </div>
        </div>
        {orders.length > 0 ? (
          <div className="flex h-full flex-col ">
            <div className="mb-2 flex justify-between px-4 text-sm text-gray-400">
              <div className="w-1/6">訂單編號</div>
              <div className="w-1/12">桌號</div>
              <div className="w-1/6">訂單收入</div>
              <div className="w-1/6">付款方式</div>
              <div className="w-1/6">接單時間</div>
              <div className="w-1/6">結帳時間</div>
              <div className="w-1/12">完成時間</div>
              <div className="w-1/12"></div>
            </div>
            <div className="hide-scrollbar flex-1 overflow-auto ">
              {orders.map((order) => (
                <div
                  key={order.orderid}
                  className="c3 mt-3 flex items-center justify-between rounded-sm  border-1 border-gray-600 bg-gray-800 px-4 py-3 text-gray-400 first:mt-0"
                >
                  <div className="w-1/6 "># {order.ordernumber}</div>
                  <div className="w-1/12">{order.tableid.padStart(2, '0')}</div>
                  <div className="w-1/6">NT ${formatCurrency(order.totalamount)}</div>
                  <div className="w-1/6">
                    <span className={` rounded-xl px-2 py-1 ${paymenttypeColor(order.paymenttype)}`}>
                      {order.paymenttype ?? '未付款'}
                    </span>
                  </div>
                  <div className="w-1/6">{formatDate(order.createtime, 'yyyy/MM/dd hh:mm')}</div>
                  <div className="w-1/6">
                    {!order.paymenttime ? '-' : formatDate(order.paymenttime, 'yyyy/MM/dd hh:mm')}
                  </div>
                  <div className="w-1/12">
                    {!order.completedtime ? '-' : formatDate(order.completedtime, 'yyyy/MM/dd hh:mm')}
                  </div>
                  <div className="w-1/12 ">
                    <div
                      className="float-end cursor-pointer rounded-sm border-2 border-gray-700 p-2"
                      onClick={() => {
                        openOrderDetail(order)
                      }}
                    >
                      <Image className="" src={`/images/36x/clipboard-list.svg`} alt="detail" width={18} height={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full rounded-sm bg-gray-800 p-8 text-center ring-1 ring-gray-600">
            <Image className="mx-auto" src={`/images/App/emptyimage.svg`} alt="emptyimage" width={168} height={104} />
            <div className="c2 mt-6">目前無訂單，又是嶄新的一天!</div>
          </div>
        )}
      </div>
      {orderdetailDialog && (
        <Dialog isOpen={orderdetailDialog} top={'15%'}>
          <div className="flex flex-col rounded-lg bg-gray-800 ">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <span className="c3 rounded-xl bg-white bg-opacity-10 px-2 py-1 text-gray-400">
                  # {orderdetailobj.ordernumber}
                </span>
                <span className={` rounded-xl px-2 py-1 ${paymenttypeColor(orderdetailobj.paymenttype)}`}>
                  {orderdetailobj.paymenttype ?? '未付款'}
                </span>
              </div>
              <div className="h2 text-center">{orderdetailobj.tableid} 桌</div>
              <div className="c4 text-center text-gray-500">
                {formatDate(orderdetailobj.createtime, 'yyyy/MM/dd hh:mm')}
              </div>
            </div>
            <div className="flex h-full  flex-col" style={{ maxHeight: '60vh' }}>
              <div className="hide-scrollbar flex  min-h-64 flex-1  flex-col divide-y divide-gray-700 overflow-auto border-y-1 border-gray-700 px-6 py-2">
                {orderdetailobj.item.map((x) => (
                  <div key={x} className=" c2  item  flex cursor-pointer  items-center   py-2 text-gray-400 ">
                    <div className="w-1/3 text-nowrap">{x[2]}</div>

                    <div className="w-1/3  text-center">{x[4]}</div>

                    <div className="w-1/3 text-end"> NT ${x[3] * x[4]}</div>
                  </div>
                ))}
              </div>
              <div className="  w-full  px-6 pb-6 pt-3 shadow-y">
                <div className="c3 flex w-full justify-between text-gray-500 ">
                  <div>Discount</div>
                  <div className="flex gap-2">
                    <span>-{formatCurrency(orderdetailobj.discount)}</span>
                  </div>
                </div>
                <div className="h3 flex w-full justify-between ">
                  <div>Total</div>
                  <div>NT ${formatCurrency(orderdetailobj.totalamount)} </div>
                </div>
              </div>
              <div className="w-full p-4 shadow-y">
                <div
                  className="c1 px-auto w-full cursor-pointer rounded-default bg-orange-500 py-3.5 text-center text-white"
                  onClick={() => closeOrderDetail()}
                >
                  關閉
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      <Dialog isOpen={removeOrderDialog} onClose={() => setRemoveOrderDialog(false)}>
        <div className="p-6 text-center">
          <div className="">
            <Image className="mx-auto" src={`/images/App/dangericon.svg`} alt="dangericon" width={50} height={50} />
          </div>

          <div className="c1 pt-4">確定清空所有訂單資料?</div>
        </div>
        <div className="c1 flex w-full  gap-2 border-t-1 p-4 ">
          <div
            className="w-full cursor-pointer rounded-default bg-gray-800 py-3.5 text-center "
            onClick={() => {
              setRemoveOrderDialog(false)
            }}
          >
            取消
          </div>
          <div
            className="w-full cursor-pointer  rounded-default bg-rose-500 py-3.5 text-center "
            onClick={() => {
              removeOrder()
            }}
          >
            確認
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default OrderList
