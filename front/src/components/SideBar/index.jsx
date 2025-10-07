import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import {
    HomeOutlined,
    ShoppingCartOutlined,
    TruckOutlined,
    UserOutlined,
    ShopOutlined,
    PrinterOutlined, CalculatorOutlined
} from '@ant-design/icons'
import { useUserContext } from '../../context/userContext'
import './styles.css'

export default function AppSidebar() {
  const { user: userContext, canAccess, isAdmin, logout } = useUserContext()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const allItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Dashboard</Link>
    },
    {
      key: 'gestao',
      icon: <UserOutlined />,
      label: 'Gestão',
      children: [
        {
          key: '/closings',
          icon: <CalculatorOutlined />,
          label: <Link to="/closings">Fechamentos</Link>
        },
        {
          key: '/employee',
          icon: <UserOutlined />,
          label: <Link to="/employee">Funcionários</Link>
        },
        {
          key: '/companies',
          icon: <ShopOutlined />,
          label: <Link to="/companies">Empresas</Link>
        }
      ]
    },
    {
      key: 'operacoes',
      icon: <TruckOutlined />,
      label: 'Operações',
      children: [
        {
          key: '/load',
          icon: <ShoppingCartOutlined />,
          label: <Link to="/load">Cargas/Pedidos</Link>
        },
        {
          key: '/vehicle-maintenance',
          icon: <TruckOutlined />,
          label: <Link to="/vehicle-maintenance">Frota</Link>
        }
      ]
    },
    {
      key: '/reports',
      icon: <PrinterOutlined />,
      label: <Link to="/reports">Relatórios</Link>
    },
    isAdmin && {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Gestão de Usuários</Link>
    }
  ]

  const screenMap = {
    '/': 'dashboard',
    '/closings': 'closings',
    '/employee': 'employees',
    '/companies': 'companies',
    '/load': 'loads',
    '/vehicle-maintenance': 'vehicles',
    '/reports': 'reports'
  }

  const filterItems = (items) => {
    return items
      .map(item => {
        if (!item) return null
        if (item.children) {
          const children = filterItems(item.children)
          if (children.length === 0) return null
          return { ...item, children }
        }
        const screen = screenMap[item.key]
        if (!screen) return item
        return (isAdmin || canAccess(screen)) ? item : null
      })
      .filter(Boolean)
  }

  const menuItems = filterItems(allItems)


  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🚛 Solução Logística</h2>
        <p>Olá, {userContext?.name || 'Usuário'}</p>
      </div>

        <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['gestao', 'operacoes']}
        items={menuItems}
        className="sidebar-menu"
      />
      
      <div className="sidebar-footer">
        <Link to="/user-profile" className="footer-link">
          <UserOutlined /> Perfil
            </Link>
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </div>
    </div>
  )
}
