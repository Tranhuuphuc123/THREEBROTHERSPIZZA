'use client'

import React, {useState} from 'react'

//import admin.module.css css toàn cục cho admin page
import './admin.css'

import Sidebar from '@/components/admin/sidebar'
import Nav from '@/components/admin/nav'

export default function RootAdminLayout({
    children,
}: Readonly<{ children: React.ReactNode}>){

    /*sử dụng state để quản lý trạng thái đong/mở của sidebar*/
    const [isCollapsed, setIsCollapsed] = useState(false)

    /*hàm để xử lý sự kiện click khi ấn vào button dấu 3- để bật/tắt sidebar*/
    const toggleSidebar= ()=>{
        //đảo ngược trạng thái hiện tại
        setIsCollapsed(!isCollapsed)
    }
    return (
        <>
            <div className= 'wrapper'>
                {/* <!-- Sidebar --> */}
                <aside id="sidebar" className={isCollapsed ? "collapsed" : ""}><Sidebar /></aside>
                {/* <!-- Sidebar end --> */}

                {/* main content */}
                <div className="main">
                    {/* nav header */}
                    <nav className="navbar navbar-expand px-3 border-bottom">
                         <Nav onToggleSidebar={toggleSidebar} />
                    </nav>
                    {/* nav header end */}

                    {/* main container */}
                    <main className="content px-3 py-2">
                        {/* <!--body container --> */}
                        <div className="container">{children}</div>
                        {/* <!--body container end--> */}
                    </main>
                    {/* main body container end*/}
                </div>
            </div>
        </>
    )
}