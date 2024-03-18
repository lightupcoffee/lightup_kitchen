// OrderContext.js
// OrderContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from '../utils/axiosInstance'

const OrderContext = createContext()

export const useOrders = () => useContext(OrderContext)

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [orderExist, setOrderExist] = useState([])

  const updateOrderList = async () => {
    const newOrders = await fetchOrders()
    handleNewOrders(newOrders)
  }

  // 封装获取订单的逻辑
  const fetchOrders = async () => {
    try {
      const response = await axios.get('/order/getTodayOrder')
      const orderlist = response.data.map((x) => ({
        ...x,
        item: JSON.parse(x.item),
      }))
      return orderlist // 直接返回订单列表
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      return [] // 错误处理
    }
  }

  const handleNewOrders = (newOrders) => {
    const newOrderIds = newOrders.map((order) => order.orderid)
    // 检查是否有新订单
    setOrderExist((prevOrderExist) => {
      const hasNewOrders = newOrderIds.some((orderid) => !prevOrderExist.includes(orderid))
      if (hasNewOrders) {
        playNotificationSound()
        return newOrderIds
      } else {
        return prevOrderExist
      }
    })
    setOrders(newOrders) // 更新订单状态
  }

  // 播放新订单音效
  const playNotificationSound = () => {
    const audio = new Audio('/sounds/neworder.wav')
    audio.play().catch((error) => console.error('播放音效失败:', error))
  }

  useEffect(() => {
    const fetchData = async () => {
      await updateOrderList()
    }

    // 首次加载时获取数据
    fetchData()

    // 定时获取订单数据
    const interval = setInterval(() => {
      fetchData()
    }, 15000) // 每15秒更新一次

    return () => clearInterval(interval)
  }, [])

  // 更新訂單內容
  const editOrderItem = async (order) => {
    await axios({
      method: 'post',
      url: '/order/editOrderItem',
      //API要求的資料
      data: {
        order: order,
      },
    })
      .then(async (res) => {
        await updateOrderList()
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
      .then(async (res) => {
        await updateOrderList()
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
  }

  // 變更訂單狀態
  const editOrder = async (orderId, data) => {
    await axios({
      method: 'post',
      url: '/order/editOrder',
      //API要求的資料
      data: {
        id: orderId,
        data: data,
      },
    })
      .then(async (res) => {
        await updateOrderList()
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        editOrderItem,
        deleteOrder,
        editOrder,
        updateOrderList,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
