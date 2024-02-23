import React from 'react'
import Image from 'next/image'
import { formatCurrency, formatDate } from '../../utils/utils'
import { useOrders } from '../../context/OrderContext'
import { useState, useEffect } from 'react'
import axios from '../../utils/axiosInstance'
import Dialog from '../components/dialog'
import Toggle from '../components/toggle'
import Loading from '../components/loading'
const EditProduct = () => {
  const { orders } = useOrders()
  const [categorys, setcategorys] = useState([])
  const [products, setproducts] = useState([])
  const [isLoading, setisLoading] = useState(false)
  useEffect(() => {
    // setisLoading(true)
    getcategory()
    getproduct()
    // setisLoading(false)
  }, [])

  const getcategory = async () => {
    await axios
      .get('/category/getAllCategory')
      .then((res) => {
        setcategorys(res.data)
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
  }

  const getproduct = async () => {
    await axios
      .get('/product/getAllProduct')
      .then((res) => {
        setproducts(res.data)
      })
      .catch((error) => {
        console.error('Failed to fetch getAllProduct:', error)
      })
  }
  return (
    <div className="flex h-screen flex-col px-8 py-9">
      {isLoading ? <Loading /> : <div>頁面內容</div>}
      <div className="flex items-center gap-2">
        <div className="h3"> 編輯菜單</div>
        <div className="  cursor-pointer  rounded-sm border-2 border-gray-700  p-1 ">
          <Image
            className="mx-auto"
            src={`/images/36x/Hero/plus.svg`} // 圖片的路徑
            alt="Add Category" // 圖片描述
            width={18} // 圖片的寬度
            height={18} // 圖片的高度
          />
        </div>
      </div>

      <div className=" flex flex-1 flex-col overflow-auto pt-3.5">
        <div className=" hide-scrollbar flex  h-full w-full flex-1 gap-3.5 overflow-x-auto ">
          {categorys.map((category) => (
            <div
              key={category.categorysid}
              className="flex h-full flex-col overflow-auto rounded-lg border-1 border-gray-600 bg-gray-800 pb-4"
              style={{ minWidth: '375px' }}
            >
              <div className="h3 p-b-3 border-b-2 border-gray-900 px-4">{category.name}</div>
              <div id="product" className="hide-scrollbar flex flex-1 flex-col gap-2.5 overflow-auto p-4 pb-0">
                {products
                  .filter((x) => x.categoryid === category.categoryid)
                  .map((product) => (
                    <div
                      key={product.productid}
                      className="flex items-center gap-4 rounded-default bg-gray-700 px-4 py-3 ring-2 ring-gray-600"
                    >
                      <Toggle />
                      <div>
                        <div className="c2">{product.name}</div>
                        <div className="c4">{product.description}</div>
                      </div>
                      <div className="ml-auto p-2.5">
                        <Image
                          className="mx-auto"
                          src={`/images/36x/Hero/pencil.svg`} // 圖片的路徑
                          alt="Edit" // 圖片描述
                          width={18} // 圖片的寬度
                          height={18} // 圖片的高度
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EditProduct
