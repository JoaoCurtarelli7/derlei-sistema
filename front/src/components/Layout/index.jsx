import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AppSidebar from '../SideBar'

export default function AppLayout() {
  const location = useLocation()

  const isLoginPage = location.pathname === '/login'

  return (
    <div className="d-flex">
      {!isLoginPage ? (
        <>
          <AppSidebar />
          <div className="flex-grow-1" style={{ padding: '20px' }}>
            <Outlet />
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}
