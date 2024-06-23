'use client'
import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { usePathname } from 'next/navigation'

const MainLayout = ({layout}) => {
    const pathname = usePathname()
    let unauthPage = ["/","/login"].includes(pathname)
  return (
    <>
      <div className="flex w-full">
       {!unauthPage && <Sidebar />} 
        <div className={unauthPage ? "!w-full": "w-full"}>
          {!unauthPage && <Navbar />} 
          {layout}
        </div>
      </div>
    </>
  )
}

export default MainLayout;