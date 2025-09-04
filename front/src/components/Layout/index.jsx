import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AppSidebar from '../SideBar'
import './styles.css'

export default function AppLayout() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <div className="layout">
      {!isLoginPage ? (
        <>
          <AppSidebar />
          <div className="content">
            <Outlet />
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}
