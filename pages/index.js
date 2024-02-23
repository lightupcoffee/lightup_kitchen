// pages/index.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/kitchen')
  }, [router])

  // 可以返回 null 或者加載指示器
  return null
}

export default Home
