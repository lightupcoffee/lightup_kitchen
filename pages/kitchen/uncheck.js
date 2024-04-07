import { formatCurrency, formatDate } from '../../utils/utils'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useOrders } from '../../context/OrderContext'
import Dialog from '../components/dialog'
import Input from '../components/input'
import axios from '../../utils/axiosInstance'
const Uncheck = () => {
  const [categorys, setCategorys] = useState([])
  const [products, setProducts] = useState([])
  const [addProductCategory, setaddProductCategory] = useState(null)
  const [addProductOption, setaddProductOption] = useState([])
  const [addProductItem, setaddProductItem] = useState(null)
  const [addProductValue, setaddProductValue] = useState(1)
  const [deleteOrderid, setdeleteOrderid] = useState(false)
  const [checkoutOrderid, setcheckoutOrderid] = useState(false)
  const [editobj, seteditobj] = useState(null)
  const [editDiscount, setEditDiscount] = useState(0)
  const { orders, editOrder, deleteOrder, editOrderItem } = useOrders()

  const [dialogStates, setDialogStates] = useState({
    addProductDialog: false,
    deleteConfirmDialog: false,
    checkoutConfirmDialog: false,
    discountDialog: false,
  })
  // 對話框開關控制
  const toggleDialog = (dialogName, isOpen) => {
    setDialogStates((prevStates) => ({ ...prevStates, [dialogName]: isOpen }))
  }

  // 資料加載
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          axios.get('/category/getAllCategory'),
          axios.get('/product/getAllProduct'),
        ])
        setCategorys(categoryRes.data)
        setProducts(productRes.data.filter((x) => x.active === true))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
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
    obj.totalamount = obj.item.reduce((a, b) => a + b[3] * b[4], 0) - obj.discount
    seteditobj(obj)
  }

  const additem = () => {
    const obj = { ...editobj }
    const value = addProductItem
    const product = products.find((x) => x.productid === value)
    if (!product) {
      console.log('product not found')
      return
    }
    const index = obj.item.findIndex((x) => x[1] == value)
    if (index === -1) {
      obj.item.push([product.categoryid, product.productid, product.name, product.price, addProductValue, 0])
    } else {
      obj.item[index][4] += addProductValue
    }

    obj.totalamount = obj.item.reduce((a, b) => a + b[3] * b[4], 0) - obj.discount
    seteditobj(obj)
    setaddProductValue(1)
    toggleDialog('addProductDialog', false)
  }
  const saveChange = () => {
    editOrderItem(editobj).then(() => {
      seteditobj(null)
    })
  }

  const openaddProductDialog = () => {
    const firstcategory = categorys[0]?.categoryid || 1
    setaddProductCategory(firstcategory)
    addProductCategoryClick(firstcategory)
    setaddProductValue(1)
    toggleDialog('addProductDialog', true)
  }
  const addProductCategoryClick = (id) => {
    setaddProductCategory(id)
    const productlist = products.filter((x) => x.categoryid === id)
    setaddProductOption(productlist)
    setaddProductItem(productlist[0]?.productid)
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

  const openEditDiscountDialog = () => {
    setEditDiscount(editobj.discount || 0)
    toggleDialog('discountDialog', true)
  }
  const handleDiscountChange = (value) => {
    if (value > editobj.totalamount) {
      value = editobj.totalamount
    }
    setEditDiscount(value)
  }
  const saveDiscount = () => {
    const total = editobj.item.reduce((a, b) => a + b[3] * b[4], 0) - editDiscount
    seteditobj((prev) => ({
      ...prev,
      discount: editDiscount,
      totalamount: total,
    }))
    toggleDialog('discountDialog', false)
  }

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
                <div className="flex items-start gap-2">
                  <span className="c3 rounded-xl bg-white bg-opacity-10 px-2 py-1 text-gray-400">
                    # {order.orderid.toString().padStart(6, '0')}
                  </span>
                  {order.paymenttype == 'Line Pay' && (
                    <span className="c3 rounded-xl bg-emerald-500/10 px-2 py-1 text-emerald-500">Line Pay</span>
                  )}
                  {order.paymenttype == 'Line Pay' ? (
                    <div
                      className="ml-auto cursor-pointer rounded-sm  border-1 p-2 "
                      onClick={() => {
                        setdeleteOrderid(order.orderid)
                        toggleDialog('deleteConfirmDialog', true)
                      }}
                    >
                      <Image src={`/images/36x/Hero/trash.svg`} alt="plus" width={18} height={18} />
                    </div>
                  ) : (
                    <div
                      className={`ml-auto cursor-pointer rounded-sm border-1 p-2 ${editobj?.orderid === order.orderid ? 'border-gray-800 bg-gray-900' : ''}`}
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
                  )}
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
                        className=" c2  item grid cursor-pointer grid-cols-12 items-center py-2 text-gray-400 "
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
                        onClick={() => openaddProductDialog()}
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
                  <div className="  w-full  px-6 pb-6 pt-3 shadow-y">
                    <div className="c3 flex w-full justify-between text-gray-500 ">
                      <div>Discount</div>
                      <div className="flex gap-2">
                        <span>-{formatCurrency(editobj.discount)}</span>
                        <div onClick={() => openEditDiscountDialog()}>
                          <Image
                            className="image-filter mx-auto"
                            src={`/images/36x/Hero/pencil.svg`}
                            alt="plus"
                            width={14}
                            height={14}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="h3 flex w-full justify-between ">
                      <div>Total</div>
                      <div>NT ${formatCurrency(editobj.totalamount)} </div>
                    </div>
                  </div>
                  <div className="w-full p-4 shadow-y">
                    <div className="flex gap-2">
                      <div
                        className="grid cursor-pointer place-items-center  rounded-default bg-rose-600 px-2.5 py-3"
                        onClick={() => {
                          setdeleteOrderid(order.orderid)
                          toggleDialog('deleteConfirmDialog', true)
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
                      <div key={x} className=" c2  flex items-center py-2 text-gray-400 ">
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
                        toggleDialog('checkoutConfirmDialog', true)
                      }}
                    >
                      訂單結帳
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        <Dialog
          isOpen={dialogStates.addProductDialog}
          onClose={() => toggleDialog('addProductDialog', false)}
          top={'20%'}
          width={'50%'}
        >
          <div className="c2 flex justify-between rounded-t-lg bg-gray-800 px-6 py-3.5 ">
            <span>新增至訂單</span>
            <div
              className="grid cursor-pointer place-items-center "
              onClick={() => toggleDialog('addProductDialog', false)}
            >
              <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
            </div>
          </div>
          <div className="p-6">
            <div className="c3 mb-1 text-gray-400">菜單品項</div>
            <div className="flex gap-4">
              <div className="hide-scrollbar h-72 w-full overflow-auto rounded-default bg-gray-800  py-2">
                {categorys.map((c) => (
                  <div
                    key={c.categoryid}
                    className={`relative flex w-full max-w-64 cursor-pointer px-2 `}
                    onClick={() => {
                      addProductCategoryClick(c.categoryid)
                    }}
                  >
                    <div
                      className={`flex w-full justify-between py-4 ${addProductCategory === c.categoryid ? 'rounded-default bg-gray-700 px-2' : ''}`}
                    >
                      <span> {c.name}</span>
                      <Image src={`/images/36x/Hero/chevron-right.svg`} alt="close" width={18} height={18} />
                    </div>
                  </div>
                ))}
              </div>{' '}
              <div className="hide-scrollbar h-72 w-full overflow-auto rounded-default bg-gray-800 py-2">
                {addProductOption.map((p) => (
                  <div
                    key={p.productid}
                    className={`relative flex w-full max-w-64 cursor-pointer px-2 `}
                    onClick={() => {
                      setaddProductItem(p.productid)
                    }}
                  >
                    <div
                      className={`flex w-full justify-between py-4 ${addProductItem === p.productid ? 'rounded-default bg-orange-500 px-2' : ''}`}
                    >
                      <span> {`${p.name + (p.remark ? ` (${p.remark})` : '')}`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="c2 flex w-full items-center gap-8 border-t-1 px-6 py-4 ">
            <div className="flex grow-0 items-center gap-3">
              <a
                className="cursor-pointer rounded-sm bg-gray-800 p-2 ring-2 ring-gray-700"
                onClick={() => (addProductValue > 1 ? setaddProductValue(addProductValue - 1) : '')}
              >
                {' '}
                <Image src={`/images/36x/Hero/minus.svg`} alt="minus" width={18} height={18} />
              </a>
              <div className="c1 w-8 text-center">{addProductValue}</div>
              <a
                className="cursor-pointer rounded-sm bg-gray-800 p-2 ring-2 ring-gray-700"
                onClick={() => setaddProductValue(addProductValue + 1)}
              >
                {' '}
                <Image src={`/images/36x/Hero/plus.svg`} alt="plus" width={18} height={18} />
              </a>
            </div>
            <div
              className=" grow cursor-pointer  rounded-default bg-orange-500 py-3.5 text-center"
              onClick={() => additem()}
            >
              新增項目
            </div>
          </div>
        </Dialog>

        <Dialog isOpen={dialogStates.deleteConfirmDialog} onClose={() => toggleDialog('deleteConfirmDialog', false)}>
          <div className="c2 flex cursor-pointer justify-between rounded-t-default  bg-gray-800 px-6 py-3.5">
            <span>確認刪除</span>
            <div
              className="grid cursor-pointer place-items-center "
              onClick={() => toggleDialog('deleteConfirmDialog', false)}
            >
              <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
            </div>
          </div>
          <div className="c1 grid min-h-32 place-items-center p-6 ">
            您是否要刪除訂單 <span className="text-rose-600">#{deleteOrderid?.toString().padStart(6, '0')}</span>
          </div>
          <div className="c2 flex w-full gap-2 border-t-1 p-4 ">
            <div
              className="w-full cursor-pointer rounded-default bg-gray-800 py-3.5 text-center "
              onClick={() => {
                toggleDialog('deleteConfirmDialog', false)
                setdeleteOrderid(null)
              }}
            >
              取消
            </div>
            <div
              className="w-full cursor-pointer  rounded-default bg-orange-500 py-3.5 text-center "
              onClick={() => {
                deleteOrder(deleteOrderid)
                toggleDialog('deleteConfirmDialog', false)
              }}
            >
              確認
            </div>
          </div>
        </Dialog>

        <Dialog
          isOpen={dialogStates.checkoutConfirmDialog}
          onClose={() => toggleDialog('checkoutConfirmDialog', false)}
        >
          <div className="c2 flex cursor-pointer justify-between rounded-t-default  bg-gray-800 px-6 py-3.5">
            <span>確認結帳</span>
            <div
              className="grid cursor-pointer place-items-center "
              onClick={() => toggleDialog('checkoutConfirmDialog', false)}
            >
              <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
            </div>
          </div>
          <div className="c1 grid min-h-32 place-items-center p-6 ">
            您是否要結帳訂單 <span className="text-lightblue-600">#{checkoutOrderid?.toString().padStart(6, '0')}</span>
          </div>
          <div className="c2 flex w-full gap-2 border-t-1 p-4 ">
            <div
              className="w-full cursor-pointer rounded-default bg-gray-800 py-3.5 text-center "
              onClick={() => {
                toggleDialog('checkoutConfirmDialog', false)
                setcheckoutOrderid(null)
              }}
            >
              取消
            </div>
            <div
              className="w-full cursor-pointer  rounded-default bg-orange-500 py-3.5 text-center "
              onClick={() => {
                editOrder(checkoutOrderid, [
                  { column: 'status', value: 1 },
                  { column: 'paymenttype', value: '現金付款' },
                  { column: 'paymenttime', value: 'NOW()' },
                ]).then(() => {
                  toggleDialog('checkoutConfirmDialog', false)
                })
              }}
            >
              確認
            </div>
          </div>
        </Dialog>

        <Dialog isOpen={dialogStates.discountDialog} onClose={() => toggleDialog('discountDialog', false)}>
          <div className="c2 flex cursor-pointer justify-between rounded-t-default  bg-gray-800 px-6 py-3.5">
            <span>新增折扣</span>
            <div
              className="grid cursor-pointer  place-items-center"
              onClick={() => toggleDialog('discountDialog', false)}
            >
              <Image src={`/images/36x/Hero/x-mark.svg`} alt="close" width={18} height={18} />
            </div>
          </div>
          <div className="p-6">
            <Input
              label="金額"
              // required
              // addError={() => setEditDiscountError(true)}
              // removeError={() => setEditDiscountError(false)}
              // helpText="請輸入金額"
              prefix="$"
              value={editDiscount}
              onChange={(val) => handleDiscountChange(val)}
              type="number"
              //min={0}
            />
          </div>
          <div className="c2 flex w-full gap-2 border-t-1 p-4 ">
            <div
              className="w-full cursor-pointer rounded-default bg-gray-800 py-3.5 text-center "
              onClick={() => {
                toggleDialog('discountDialog', false)
              }}
            >
              取消
            </div>
            <div
              className={`w-full cursor-pointer  rounded-default  bg-orange-500 py-3.5 text-center `}
              onClick={() => saveDiscount()}
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
