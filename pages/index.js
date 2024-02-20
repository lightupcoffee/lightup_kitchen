// pages/index.js
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Kitchen from './kitchen/kitchen'
import OrderList from './orderlist/orderlist'
import EditProduct from './editproduct/editproduct'
import axios from '../utils/axiosInstance'
function Home({ categorys, products }) {
  const sidebarpage = {
    kitchen: 1,
    orderlist: 2,
    editproduct: 3,
  }
  const [currentpage, setcurrentpage] = useState(sidebarpage.kitchen)

  return (
    <div className="flex h-svh ">
      <div id="sidenav" className="flex w-32 flex-col justify-end gap-8 bg-gray-800 px-6 py-16 ">
        {Object.values(sidebarpage).map((x) => (
          <div
            onClick={() => {
              setcurrentpage(x)
            }}
            key={x} // 添加 key 属性，因为我们在 map 中渲染列表
            className={`px-4 py-3 ${currentpage === x ? 'rounded-xl bg-gray-700 opacity-100' : 'opacity-40'}`}
          >
            <Image
              className="mx-auto"
              src={`/images/36x/Hero/document-text.svg`} // 圖片的路徑
              alt="document-text" // 圖片描述
              width={48} // 圖片的寬度
              height={48} // 圖片的高度
            />
          </div>
        ))}
      </div>
      <div id="content" className="flex-1 bg-gray-900">
        {currentpage === sidebarpage.kitchen && <Kitchen categorys={categorys} products={products}></Kitchen>}
        {currentpage === sidebarpage.orderlist && <OrderList></OrderList>}
        {currentpage === sidebarpage.editproduct && <EditProduct></EditProduct>}
      </div>
    </div>
  )
}
export async function getServerSideProps() {
  let categorys = []
  let products = []
  await axios
    .get('/category/getAllCategory')
    .then((res) => {
      categorys = res.data
    })
    .catch((error) => {
      console.error('Failed to fetch data:', error)
    })
  await axios
    .get('/product/getAllProduct')
    .then((res) => {
      products = res.data
    })
    .catch((error) => {
      console.error('Failed to fetch getAllProduct:', error)
    })
  return {
    props: {
      categorys: categorys,
      products: products,
    },
    //revalidate: 10, // In seconds (optional, for incremental static regeneration)
  }
}
export default Home
