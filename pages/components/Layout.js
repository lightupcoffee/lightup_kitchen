import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
const Layout = ({ children }) => {
  const router = useRouter()
  const sidebarpage = [
    { page: '/kitchen', image: 'document-text' },
    { page: '/orderlist', image: 'document-text' },
    { page: '/editproduct', image: 'document-text' },
  ]
  return (
    <div className="flex h-dvh max-w-full">
      {/* Sidenav */}
      <div id="sidenav" className="flex w-16 shrink-0 flex-col justify-end gap-4 bg-gray-800 px-3 py-8">
        {sidebarpage.map((x) => (
          <Link key={x.page} href={x.page}>
            <div
              className={`px-2 py-2 ${router.asPath === x.page ? 'rounded-xl bg-gray-700 opacity-100' : 'opacity-40'}`}
            >
              <Image
                className="mx-auto"
                src={`/images/36x/Hero/${x.image}.svg`} // 圖片的路徑
                alt="document-text" // 圖片描述
                width={32} // 圖片的寬度
                height={32} // 圖片的高度
              />
            </div>
          </Link>
        ))}
      </div>

      <div className=" flex-1" style={{ width: 'calc(100% - 4rem)' }}>
        {children}
      </div>
    </div>
  )
}
export default Layout
