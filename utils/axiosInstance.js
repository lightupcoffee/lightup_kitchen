// utils/axiosInstance.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api', // 你的 API 基礎 URL
  // 你可以在這裡添加更多的配置
})

export default axiosInstance
