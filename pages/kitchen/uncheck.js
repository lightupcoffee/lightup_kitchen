import { formatCurrency } from '../../utils/utils'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useOrders } from '../../context/OrderContext'
import Dialog from '../components/dialog'
import Dropdown from '../components/dropdown'
const Uncheck = ({ categorys, products }) => {
  const [addProductDialog, setaddProductDialog] = useState(false)
  const [deleteConfirmDialog, setdeleteConfirmDialog] = useState(false)
  const [deleteorderid, setdeleteorderid] = useState(false)
  const [editobj, seteditobj] = useState(null)
  const { orders, updateOrder, deleteOrder, updateOrderStatus } = useOrders()
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
  const editmode = (order) => {
    seteditobj({ ...order })
  }
  const editorderitem = (productid, type) => {
    const obj = { ...editobj }

    const index = obj.item.findIndex((x) => x[1] === productid)
    if (index === -1) {
      console.log('product not found')
    }
    const product = obj.item[index]
    switch (type) {
      case 'minus':
        product[4] -= 1

        break
      case 'plus':
        product[4] += 1
    }
    if (product[4] <= 0) {
      obj.item.splice(index, 1)
    }
    obj.totalamount = obj.item.reduce((a, b) => a + b[3] * b[4], 0)
    seteditobj(obj)
  }

  const additem = (value) => {
    const obj = { ...editobj }
    const product = products.find((x) => x.productid === value)
    if (!product) {
      console.log('product not found')
      return
    }
    const index = obj.item.findIndex((x) => x[1] == value)
    if (index === -1) {
      obj.item.push([product.categoryid, product.productid, product.name, product.price, 1, 0])
    } else {
      obj.item[index][4] += 1
    }

    obj.totalamount = obj.item.reduce((a, b) => a + b[3] * b[4], 0)
    seteditobj(obj)
    setaddProductDialog(false)
  }
  const saveChange = () => {
    updateOrder(editobj).then(() => {
      seteditobj(null)
    })
  }
  //新增產品的下拉選單資料
  const productoption = categorys?.map((c) => {
    const productlist = products.filter((x) => x.categoryid == c.categoryid)
    return {
      name: c.name,
      value: c.categoryid,
      subitem:
        productlist.length > 0
          ? productlist.map((p) => {
              return {
                name: p.name,
                value: p.productid,
              }
            })
          : null,
    }
  })
  return (
    <div className=" h-full px-12 pt-7.5">
      <div id="redarea" className=" hide-scrollbar flex h-full w-full gap-7.5 overflow-x-auto ">
        {orders
          .filter((x) => x.status === 0)
          .map((order) => (
            <div key={order.orderid} className="flex flex-col rounded-lg bg-gray-800 " style={{ minWidth: '770px' }}>
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <span className="c3 rounded-xl bg-white bg-opacity-10 px-4 py-2 text-gray-400">
                    # {order.orderid.toString().padStart(6, '0')}
                  </span>
                  <div
                    className={` cursor-pointer rounded-sm border-2 p-4 ${editobj?.orderid === order.orderid ? 'border-gray-800 bg-gray-900' : ''}`}
                    onClick={() => {
                      editmode(order)
                    }}
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${editobj?.orderid === order.orderid ? 'stroke-gray-600' : 'stroke-white'}`}
                    >
                      <path
                        d="M25.293 6.73014L27.8235 4.19814C28.351 3.67062 29.0665 3.37427 29.8125 3.37427C30.5585 3.37427 31.274 3.67062 31.8015 4.19814C32.329 4.72565 32.6254 5.44112 32.6254 6.18714C32.6254 6.93316 32.329 7.64862 31.8015 8.17614L10.248 29.7296C9.45499 30.5222 8.47705 31.1047 7.4025 31.4246L3.375 32.6246L4.575 28.5971C4.89492 27.5226 5.47745 26.5446 6.27 25.7516L25.2945 6.73014H25.293ZM25.293 6.73014L29.25 10.6871"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="h2 text-center">{order.tableid} 桌</div>
                <div className="c4 text-center text-gray-500">{formatDate(order.createtime)}</div>
              </div>
              {editobj?.orderid === order.orderid ? ( //編輯模式
                <div className="flex h-full flex-col">
                  <div className="hide-scrollbar flex  flex-1   flex-col divide-y divide-gray-700 overflow-auto border-y-1 border-gray-700 px-12 py-4">
                    {editobj.item.map((x) => (
                      <div
                        key={x}
                        className=" c2  item grid cursor-pointer grid-cols-12 items-center   py-4 text-gray-400 "
                      >
                        <div className="col-start-1 col-end-5 text-nowrap">{x[2]}</div>

                        <div className="col-start-6 col-end-9 flex ">
                          <Image
                            onClick={() => editorderitem(x[1], 'minus')}
                            className="image-filter mx-auto"
                            src={`/images/App/minus24x24.svg`}
                            alt="/minus"
                            width={36}
                            height={36}
                          />
                          <div className="w-12 text-center">{x[4]}</div>
                          <Image
                            onClick={() => editorderitem(x[1], 'plus')}
                            className="image-filter mx-auto"
                            src={`/images/App/plus24x24.svg`}
                            alt="plus"
                            width={36}
                            height={36}
                          />
                        </div>
                        <div className="col-start-10 col-end-13 text-end"> NT ${x[3] * x[4]}</div>
                      </div>
                    ))}
                    <div className="  py-4">
                      <div
                        onClick={() => setaddProductDialog(true)}
                        className="c2 grid w-full place-items-center rounded-default border-2 border-dashed border-gray-500 bg-gray-700 py-3 text-center "
                      >
                        <Image
                          className="image-filter mx-auto"
                          src={`/images/36x/Hero/plus.svg`}
                          alt="plus"
                          width={36}
                          height={36}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="h3 flex w-full justify-between px-12 pb-12 pt-6 shadow-y">
                    <div>Total</div>
                    <div>NT ${formatCurrency(editobj.totalamount)}</div>
                  </div>
                  <div className="w-full p-8 shadow-y">
                    <div className="flex gap-4">
                      <div
                        className="grid place-items-center rounded-default bg-rose-600 px-9.5 py-7"
                        onClick={() => {
                          setdeleteorderid(order.orderid)
                          setdeleteConfirmDialog(true)
                        }}
                      >
                        <Image src={`/images/36x/Hero/trash.svg`} alt="plus" width={48} height={48} />
                      </div>
                      <div className="c1 px-auto w-full rounded-default border py-7 text-center" onClick={saveChange}>
                        儲存編輯
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col">
                  <div className="hide-scrollbar flex  flex-1   flex-col divide-y divide-gray-700 overflow-auto border-y-1 border-gray-700 px-12 py-4">
                    {order.item.map((x) => (
                      <div
                        key={x}
                        className=" c2  item grid cursor-pointer grid-cols-12 items-center   py-4 text-gray-400 "
                      >
                        <div className="col-start-1 col-end-5 text-nowrap">{x[2]}</div>

                        <div className="col-start-7 col-end-8 ">{x[4]}</div>

                        <div className="col-start-10 col-end-13 text-end"> NT ${x[3] * x[4]}</div>
                      </div>
                    ))}
                  </div>
                  <div className="h3 flex w-full justify-between px-12 pb-12 pt-6 shadow-y">
                    <div>Total</div>
                    <div>NT ${formatCurrency(order.totalamount)}</div>
                  </div>
                  <div className="w-full p-8 shadow-y">
                    <div
                      className="c1 px-auto w-full rounded-default bg-orange-500 py-7 text-center text-white"
                      onClick={() => updateOrderStatus(order.orderid, 1)}
                    >
                      訂單結帳
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        <Dialog isOpen={addProductDialog} onClose={() => setaddProductDialog(false)}>
          <div className="c2 flex justify-between rounded-t-lg bg-gray-800 px-12 py-7.5">
            <span>新增品項</span>
            <div className="grid place-items-center  " onClick={() => setaddProductDialog(false)}>
              <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={36} height={36} />
            </div>
          </div>
          <div className="p-12">
            <Dropdown option={productoption} onSelect={additem} />
          </div>
        </Dialog>

        <Dialog isOpen={deleteConfirmDialog} onClose={() => setdeleteConfirmDialog(false)}>
          <div className="c2 flex justify-between rounded-t-lg bg-gray-800 px-12 py-7.5">
            <span>確認刪除</span>
            <div className="grid place-items-center  " onClick={() => setdeleteConfirmDialog(false)}>
              <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={36} height={36} />
            </div>
          </div>
          <div className="c1 grid min-h-64 place-items-center p-12">
            您是否要刪除訂單 <span className="text-rose-600">#{deleteorderid?.toString().padStart(6, '0')}</span>
          </div>
          <div className="c2 flex w-full gap-4 border-t-1 p-8 ">
            <div
              className="w-full rounded-default bg-gray-800 py-7 text-center"
              onClick={() => {
                setdeleteConfirmDialog(false)
                setdeleteorderid(null)
              }}
            >
              取消
            </div>
            <div
              className="w-full rounded-default  bg-orange-500 py-7 text-center"
              onClick={() => {
                deleteOrder(deleteorderid)
                setdeleteConfirmDialog(false)
              }}
            >
              確認
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  )
}

export default Uncheck
