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
    <div className="flex max-w-full ">
      <div id="sidenav" className="flex w-16 shrink-0 flex-col justify-end gap-4 bg-gray-800 px-3 py-8 ">
        {Object.values(sidebarpage).map((x) => (
          <div
            onClick={() => {
              setcurrentpage(x)
            }}
            key={x}
            className={`px-2 py-2 ${currentpage === x ? 'rounded-default bg-gray-700 opacity-100' : 'opacity-40'}`}
          >
            <Image
              className="mx-auto"
              src={`/images/36x/Hero/document-text.svg`} // 圖片的路徑
              alt="document-text" // 圖片描述
              width={32} // 圖片的寬度
              height={32} // 圖片的高度
            />
          </div>
        ))}
      </div>

      <div className=" h-svh max-w-full  bg-gray-900" style={{ width: 'calc(100vw - 64px)' }}>
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
