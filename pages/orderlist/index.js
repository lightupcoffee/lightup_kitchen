import React from 'react'
import Image from 'next/image'
import { formatCurrency, formatDate } from '../../utils/utils'
import { useOrders } from '../../context/OrderContext'
import { useState, useEffect } from 'react'
import Dialog from '../components/dialog'
const OrderList = () => {
  const [orderdetailDialog, setorderdetailDialog] = useState(false)
  const [orderdetailobj, setorderdetailobj] = useState(null)
  const { orders } = useOrders()
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
  return (
    <div className="flex h-full flex-col px-8 py-9">
      <div className="flex h-full flex-col ">
        <div className="flex justify-between">
          <div className="h3"> 訂單紀錄</div>
          <div className="c2 flex cursor-pointer items-center gap-1 rounded-sm border-2 border-gray-700 px-3 py-1 text-gray-200">
            <Image
              className="mx-auto"
              src={`/images/36x/Hero/arrow-down-tray.svg`} // 圖片的路徑
              alt="arrow-down" // 圖片描述
              width={18} // 圖片的寬度
              height={18} // 圖片的高度
            />
            下載
          </div>
        </div>
        <div className="mb-2 mt-3 flex justify-between px-4 text-sm text-gray-400">
          <div className="w-1/6">訂單編號</div>
          <div className="w-1/12">桌號</div>
          <div className="w-1/6">訂單收入</div>
          <div className="w-1/6">付款方式</div>
          <div className="w-1/4">接單時間</div>
          <div className="w-1/6">結帳時間</div>
          <div className="w-1/12"></div>
        </div>
        <div className="hide-scrollbar flex-1 overflow-auto ">
          {orders.map((order) => (
            <div
              key={order.orderid}
              className="c3 mt-3 flex items-center justify-between rounded-sm  border-1 border-gray-600 bg-gray-800 px-4 py-3 text-gray-400 first:mt-0"
            >
              <div className="w-1/6 "># {order.orderid.toString().padStart(6, '0')}</div>
              <div className="w-1/12">{order.tableid.padStart(2, '0')}</div>
              <div className="w-1/6">NT ${formatCurrency(order.totalamount)}</div>
              <div className="w-1/6">
                <span className={` rounded-xl px-2 py-1 ${paymenttypeColor(order.paymenttype)}`}>
                  {order.paymenttype ?? '未付款'}
                </span>
              </div>
              <div className="w-1/4">{formatDate(order.createtime)}</div>
              <div className="w-1/6">{!order.paymenttime ? '-' : formatDate(order.paymenttime)}</div>
              <div className="w-1/12 ">
                <div
                  className="float-end cursor-pointer rounded-sm border-2 border-gray-700 p-2"
                  onClick={() => {
                    openOrderDetail(order)
                  }}
                >
                  <Image
                    className=""
                    src={`/images/36x/clipboard-list.svg`} // 圖片的路徑
                    alt="detail" // 圖片描述
                    width={18} // 圖片的寬度
                    height={18} // 圖片的高度
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {orderdetailDialog && (
        <Dialog isOpen={orderdetailDialog}>
          <div className="flex flex-col rounded-lg bg-gray-800 ">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <span className="c3 rounded-xl bg-white bg-opacity-10 px-2 py-1 text-gray-400">
                  # {orderdetailobj.orderid.toString().padStart(6, '0')}
                </span>
              </div>
              <div className="h2 text-center">{orderdetailobj.tableid} 桌</div>
              <div className="c4 text-center text-gray-500">{formatDate(orderdetailobj.createtime)}</div>
            </div>
            <div className="flex h-full flex-col">
              <div className="hide-scrollbar flex  flex-1   flex-col divide-y divide-gray-700 overflow-auto border-y-1 border-gray-700 px-6 py-2">
                {orderdetailobj.item.map((x) => (
                  <div key={x} className=" c2  item  flex cursor-pointer  items-center   py-2 text-gray-400 ">
                    <div className="w-1/3 text-nowrap">{x[2]}</div>

                    <div className="w-1/3  text-center">{x[4]}</div>

                    <div className="w-1/3 text-end"> NT ${x[3] * x[4]}</div>
                  </div>
                ))}
              </div>
              <div className="h3 flex w-full justify-between px-6 pb-6 pt-3 shadow-y">
                <div>Total</div>
                <div>NT ${formatCurrency(orderdetailobj.totalamount)}</div>
              </div>
              <div className="w-full p-4 shadow-y">
                <div
                  className="c1 px-auto w-full cursor-pointer rounded-default bg-gray-500 py-3.5 text-center text-white"
                  onClick={() => closeOrderDetail()}
                >
                  關閉
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default OrderList
