// OrderContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from '../utils/axiosInstance'
const OrderContext = createContext()

export const useOrders = () => useContext(OrderContext)

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])

  // 定時更新訂單數據
  useEffect(() => {
    fetchOrders()
    const interval = setInterval(() => {
      fetchOrders()
    }, 15000) // 每15秒更新一次

    return () => clearInterval(interval)
  }, [])
  const fetchOrders = async () => {
    await axios
      .get('/order/getAllOrder')
      .then((res) => {
        const orderlist = res.data.map((x) => {
          return { ...x, item: JSON.parse(x.item) }
        })
        setOrders(orderlist)
      })
      .catch((error) => {
        console.error('Failed to fetch getAllOrder:', error)
      })
  }

  // 更新訂單內容
  const updateOrderItem = async (order) => {
    await axios({
      method: 'post',
      url: '/order/updateOrderItem',
      //API要求的資料
      data: {
        order: order,
      },
    })
      .then((res) => {
        fetchOrders()
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
  }

  // 刪除訂單
  const deleteOrder = async (orderId) => {
    await axios({
      method: 'post',
      url: '/order/deleteOrderbyId',
      //API要求的資料
      data: {
        id: orderId,
      },
    })
      .then((res) => {
        fetchOrders()
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
  }

  // 變更訂單狀態
  const updateOrder = async (orderId, data) => {
    await axios({
      method: 'post',
      url: '/order/updateOrder',
      //API要求的資料
      data: {
        orderId: orderId,
        data: data,
      },
    })
      .then((res) => {
        fetchOrders()
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        updateOrderItem,
        deleteOrder,
        updateOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
