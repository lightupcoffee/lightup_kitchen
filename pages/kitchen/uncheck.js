import { formatCurrency, formatDate } from '../../utils/utils'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useOrders } from '../../context/OrderContext'
import Dialog from '../components/dialog'
import Dropdown from '../components/dropdown'
import axios from '../../utils/axiosInstance'
const Uncheck = () => {
  const [categorys, setcategorys] = useState([])
  const [products, setproducts] = useState([])
  const [addProductDialog, setaddProductDialog] = useState(false)
  const [deleteConfirmDialog, setdeleteConfirmDialog] = useState(false)
  const [deleteOrderid, setdeleteOrderid] = useState(false)
  const [checkoutConfirmDialog, setcheckoutConfirmDialog] = useState(false)
  const [checkoutOrderid, setcheckoutOrderid] = useState(false)
  const [editobj, seteditobj] = useState(null)
  const { orders, updateOrder, deleteOrder, updateOrderItem } = useOrders()

  useEffect(() => {
    axios
      .get('/category/getAllCategory')
      .then((res) => {
        setcategorys(res.data)
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
    axios
      .get('/product/getAllProduct')
      .then((res) => {
        setproducts(res.data)
      })
      .catch((error) => {
        console.error('Failed to fetch getAllProduct:', error)
      })
  }, [])
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
    updateOrderItem(editobj).then(() => {
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
                name: p.name + (p.remark ? ` (${p.remark})` : ''),
                value: p.productid,
              }
            })
          : null,
    }
  })
  return (
    <div className=" hide-scrollbar h-full overflow-auto pt-3.5">
      <div className=" flex h-full w-full gap-3.5  ">
        {orders
          .filter((x) => x.status === 0)
          .map((order) => (
            <div
              key={order.orderid}
              className="flex flex-col overflow-auto rounded-lg border-1 border-gray-600 bg-gray-800"
              style={{ minWidth: '375px' }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <span className="c3 rounded-xl bg-white bg-opacity-10 px-2 py-1 text-gray-400">
                    # {order.orderid.toString().padStart(6, '0')}
                  </span>
                  <div
                    className={` cursor-pointer rounded-sm border-1 p-2 ${editobj?.orderid === order.orderid ? 'border-gray-800 bg-gray-900' : ''}`}
                    onClick={() => {
                      editmode(order)
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
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
                <div className="c4 text-center text-gray-500">{formatDate(order.createtime, 'yyyy/MM/dd hh:mm')}</div>
              </div>
              {editobj?.orderid === order.orderid ? ( //編輯模式
                <div className="flex flex-1 flex-col overflow-auto ">
                  <div className="hide-scrollbar flex  flex-1   flex-col divide-y divide-gray-700 overflow-auto border-y-1 border-gray-700 px-6 py-2">
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
                            width={18}
                            height={18}
                          />
                          <div className="w-6 text-center">{x[4]}</div>
                          <Image
                            onClick={() => editorderitem(x[1], 'plus')}
                            className="image-filter mx-auto"
                            src={`/images/App/plus24x24.svg`}
                            alt="plus"
                            width={18}
                            height={18}
                          />
                        </div>
                        <div className="col-start-10 col-end-13 text-end"> NT ${x[3] * x[4]}</div>
                      </div>
                    ))}
                    <div className="  py-2">
                      <div
                        onClick={() => setaddProductDialog(true)}
                        className="c2 grid w-full place-items-center rounded-default border-2 border-dashed border-gray-500 bg-gray-700 py-1.5 text-center "
                      >
                        <Image
                          className="image-filter mx-auto"
                          src={`/images/36x/Hero/plus.svg`}
                          alt="plus"
                          width={18}
                          height={18}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="h3 flex w-full justify-between px-12 pb-6 pt-3 shadow-y">
                    <div>Total</div>
                    <div>NT ${formatCurrency(editobj.totalamount)}</div>
                  </div>
                  <div className="w-full p-4 shadow-y">
                    <div className="flex gap-2">
                      <div
                        className="grid cursor-pointer place-items-center  rounded-default bg-rose-600 px-2.5 py-3"
                        onClick={() => {
                          setdeleteOrderid(order.orderid)
                          setdeleteConfirmDialog(true)
                        }}
                      >
                        <Image src={`/images/36x/Hero/trash.svg`} alt="plus" width={24} height={24} />
                      </div>
                      <div
                        className="c1 px-auto  w-full cursor-pointer rounded-default border py-3.5 text-center"
                        onClick={saveChange}
                      >
                        儲存編輯
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col overflow-auto">
                  <div className="hide-scrollbar flex  flex-1   flex-col divide-y divide-gray-700 overflow-auto border-y-1 border-gray-700 px-6 py-2">
                    {order.item.map((x) => (
                      <div key={x} className=" c2  flex items-center   py-2 text-gray-400 ">
                        <div className="w-1/2">{x[2]}</div>

                        <div className="w-1/6 text-center">{x[4]}</div>

                        <div className="w-1/3 text-end"> NT ${x[3] * x[4]}</div>
                      </div>
                    ))}
                  </div>
                  <div className="h3 flex w-full justify-between px-6 pb-6 pt-3 shadow-y">
                    <div>Total</div>
                    <div>NT ${formatCurrency(order.totalamount)}</div>
                  </div>
                  <div className="w-full p-4 shadow-y">
                    <div
                      className="c1 px-auto w-full cursor-pointer rounded-default  bg-orange-500 py-3.5 text-center text-white"
                      onClick={() => {
                        setcheckoutOrderid(order.orderid)
                        setcheckoutConfirmDialog(true)
                      }}
                    >
                      訂單結帳
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        <Dialog isOpen={addProductDialog} onClose={() => setaddProductDialog(false)}>
          <div className="c2 flex justify-between rounded-t-lg bg-gray-800 px-6 py-3.5 ">
            <span>新增品項</span>
            <div className="grid place-items-center  " onClick={() => setaddProductDialog(false)}>
              <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
            </div>
          </div>
          <div className="p-6">
            <Dropdown option={productoption} onSelect={additem} />
          </div>
        </Dialog>

        <Dialog isOpen={deleteConfirmDialog} onClose={() => setdeleteConfirmDialog(false)}>
          <div className="c2 flex cursor-pointer justify-between rounded-t-default  bg-gray-800 px-6 py-3.5">
            <span>確認刪除</span>
            <div className="grid place-items-center  " onClick={() => setdeleteConfirmDialog(false)}>
              <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
            </div>
          </div>
          <div className="c1 grid min-h-32 place-items-center p-6 ">
            您是否要刪除訂單 <span className="text-rose-600">#{deleteOrderid?.toString().padStart(6, '0')}</span>
          </div>
          <div className="c2 flex w-full gap-2 border-t-1 p-4 ">
            <div
              className="w-full rounded-default bg-gray-800 py-3.5 text-center"
              onClick={() => {
                setdeleteConfirmDialog(false)
                setdeleteOrderid(null)
              }}
            >
              取消
            </div>
            <div
              className="w-full cursor-pointer  rounded-default bg-orange-500 py-3.5 text-center "
              onClick={() => {
                deleteOrder(deleteOrderid)
                setdeleteConfirmDialog(false)
              }}
            >
              確認
            </div>
          </div>
        </Dialog>

        <Dialog isOpen={checkoutConfirmDialog} onClose={() => setcheckoutConfirmDialog(false)}>
          <div className="c2 flex cursor-pointer justify-between rounded-t-default  bg-gray-800 px-6 py-3.5">
            <span>確認結帳</span>
            <div className="grid place-items-center  " onClick={() => setcheckoutConfirmDialog(false)}>
              <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
            </div>
          </div>
          <div className="c1 grid min-h-32 place-items-center p-6 ">
            您是否要結帳訂單 <span className="text-lightblue-600">#{checkoutOrderid?.toString().padStart(6, '0')}</span>
          </div>
          <div className="c2 flex w-full gap-2 border-t-1 p-4 ">
            <div
              className="w-full rounded-default bg-gray-800 py-3.5 text-center"
              onClick={() => {
                setcheckoutConfirmDialog(false)
                setcheckoutOrderid(null)
              }}
            >
              取消
            </div>
            <div
              className="w-full cursor-pointer  rounded-default bg-orange-500 py-3.5 text-center "
              onClick={() => {
                updateOrder(checkoutOrderid, [
                  { column: 'status', value: 1 },
                  { column: 'paymenttype', value: `'現金付款'` },
                  { column: 'paymenttime', value: `NOW()` },
                ]).then(() => {
                  setcheckoutConfirmDialog(false)
                })
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
