// pages/_app.js
import Head from 'next/head'
import '../styles/globals.css' // 調整路徑以符合你的檔案結構

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Light up Kitchen</title>
        <meta name="keywords" content="Light up cafe&bar" />
        <meta name="description" content="咖啡、康普氣泡、酒精飲料、餐點、甜點" />
        <meta name="author" content="s900bill" />
        <meta
          className="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans+TC:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
