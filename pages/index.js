// pages/index.js
import React, { useState, useEffect } from 'react'
import axios from '../utils/axiosInstance'
import Image from 'next/image'
import { useRouter } from 'next/router'

function Home({}) {
  return (
    <div>
      <div className="h1">Web H1 - Monserrat Bold - 64px </div>
      <div className="h2">Web H2 - Monserrat Bold - 56px </div>
      <div className="h3">Web H3 - Monserrat Semibold - 40px </div>
      <div className="c1">Web C1 - Monserrat Medium - 40px </div>
      <div className="c2">Web C2 - Monserrat Medium - 32px </div>
      <div className="c3">Web C3 - Monserrat Medium - 28px </div>
      <div className="c4">Web Caption - Monserrat Medium - 24px </div>

      <div className="h1">中文 H1 - Noto Sans TC Bold - 64px </div>
      <div className="h2">中文 H2 - Noto Sans TC Bold - 56px </div>
      <div className="h3">中文 H3 - Noto Sans TC Semibold - 40px </div>
      <div className="c1">中文 C1 - Noto Sans TC Medium - 40px </div>
      <div className="c2">中文 C2 - Noto Sans TC Medium - 32px </div>
      <div className="c3">中文 C3 - Noto Sans TC Medium - 28px </div>
      <div className="c4">中文 Caption - Noto Sans TC Medium - 24px </div>
    </div>
  )
}

export default Home
