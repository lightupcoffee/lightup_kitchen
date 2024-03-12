import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
const Layout = ({ children }) => {
  const router = useRouter()
  const sidebarpage = [
    { page: '/kitchen', image: 'document-text', tooltip: '廚房介面' },
    { page: '/orderlist', image: 'document-text', tooltip: '訂單列表' },
    { page: '/editmenu', image: 'document-text', tooltip: '編輯菜單' },
  ]
  return (
    <div className="flex h-dvh max-w-full">
      {/* Sidenav */}
      <div id="sidenav" className=" flex w-16 shrink-0 flex-col justify-end gap-4 bg-gray-800 px-3 py-8">
        {sidebarpage.map((x) => (
          <div key={x.page} className="group relative">
            <Link href={x.page} prefetch={true}>
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
            {/* Tooltip */}
            <div className="c2 absolute left-14 top-1/2 hidden translate-y-[-50%] text-nowrap rounded-md border border-gray-700 bg-gray-900 px-2 py-1 group-hover:block">
              {x.tooltip}
            </div>
          </div>
        ))}
      </div>

      <div className=" flex-1" style={{ width: 'calc(100% - 4rem)' }}>
        {children}
      </div>
    </div>
  )
}
export default Layout
