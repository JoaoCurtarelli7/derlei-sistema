import React from 'react'
import { Outlet } from 'react-router-dom'
import AppSidebar from '../SideBar'

export default function AppLayout() {
  return (
    <div className="d-flex">
      <AppSidebar />

      <div className="flex-grow-1" style={{ padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  )
}
