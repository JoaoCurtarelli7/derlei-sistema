import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import {
  FaHome,
  FaShoppingCart,
  FaTruckMoving,
  FaUsers,
  FaStoreAlt,
  FaMoneyBillWave,
  FaPrint,
} from 'react-icons/fa'
import Dropdown from 'react-bootstrap/Dropdown'
import user from '../assets/user.png'
import moment from 'moment'
import './styles.css'
import { useUserContext } from '../../context/userContext'

export default function AppSidebar() {
  const { user: userContext } = useUserContext()

  const currentHour = moment().hour()

  let greeting = 'Bom dia'
  if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Boa tarde'
  } else if (currentHour >= 18 || currentHour < 6) {
    greeting = 'Boa noite'
  }

  return (
    <div className="d-flex">
      <nav className="sidebar">
        <Link
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span className="fs-4">
            {greeting}, {userContext?.name}
          </span>
        </Link>
        <hr />

        <Menu
          mode="vertical"
          className="bg-dark text-white"
          theme="dark"
          style={{ border: 'none' }}
        >
          <Menu.Item key="/" icon={<FaHome className="me-2" />}>
            <Link to="/" className="text-decoration-none">
              Home
            </Link>
          </Menu.Item>

          <Menu.Item
            key="/closing-month"
            icon={<FaMoneyBillWave className="me-2" />}
          >
            <Link to="/closing-month" className="text-decoration-none">
              Fechamento
            </Link>
          </Menu.Item>

          <Menu.Item key="/load" icon={<FaShoppingCart className="me-2" />}>
            <Link to="/load" className="text-decoration-none">
              Carga/Pedidos
            </Link>
          </Menu.Item>

          <Menu.Item key="/employee" icon={<FaUsers className="me-2" />}>
            <Link to="/employee" className="text-decoration-none">
              Funcionário
            </Link>
          </Menu.Item>

          <Menu.Item
            key="/vehicle-maintenance"
            icon={<FaTruckMoving className="me-2" />}
          >
            <Link to="/vehicle-maintenance" className="text-decoration-none">
              Manutenção Veículos
            </Link>
          </Menu.Item>

          <Menu.Item key="/companies" icon={<FaStoreAlt className="me-2" />}>
            <Link to="/companies" className="text-decoration-none">
              Empresas
            </Link>
          </Menu.Item>

          <Menu.Item key="/report" icon={<FaPrint className="me-2" />}>
            <Link to="/report" className="text-decoration-none">
              Relatorios
            </Link>
          </Menu.Item>
        </Menu>

        <hr />

        <Dropdown className="sidebar-dropdown">
          <Dropdown.Toggle
            id="dropdown-user"
            className="d-flex align-items-center text-white bg-transparent border-0"
          >
            <img
              src={user}
              alt=""
              width="32"
              height="32"
              className="rounded-circle me-2"
            />
            <strong style={{ margin: ' 010px' }}>Perfil</strong>
          </Dropdown.Toggle>

          <Dropdown.Menu variant="dark" className="dropdown-menu-custom">
            <Dropdown.Item href="/user-profile">Conta</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/login">Sair</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </nav>
    </div>
  )
}
