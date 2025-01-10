import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import {
  FaHome,
  FaTachometerAlt,
  FaShoppingCart,
  FaBoxes,
  FaUser,
} from 'react-icons/fa'
import { FaCompassDrafting } from 'react-icons/fa6'

export default function AppSidebar() {
  return (
    <div className="d-flex">
      <nav
        className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
        style={{ width: '280px', height: '100vh' }}
      >
        <Link
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span className="fs-4">Derlei</span>
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

          <Menu.Item key="/closing" icon={<FaTachometerAlt className="me-2" />}>
            <Link to="/closing" className="text-decoration-none">
              Fechamento
            </Link>
          </Menu.Item>

          <Menu.Item key="/load" icon={<FaShoppingCart className="me-2" />}>
            <Link to="/load" className="text-decoration-none">
              Carga/Pedidos
            </Link>
          </Menu.Item>

          <Menu.Item key="/employee" icon={<FaBoxes className="me-2" />}>
            <Link to="/employee" className="text-decoration-none">
              Funcionário
            </Link>
          </Menu.Item>

          <Menu.Item
            key="/vehicle-maintenance"
            icon={<FaUser className="me-2" />}
          >
            <Link to="/vehicle-maintenance" className="text-decoration-none">
              Manutenção Veículos
            </Link>
          </Menu.Item>

          <Menu.Item
            key="/companies"
            icon={<FaCompassDrafting className="me-2" />}
          >
            <Link to="/companies" className="text-decoration-none">
              Empresas
            </Link>
          </Menu.Item>
        </Menu>

        <hr />

        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://via.placeholder.com/32"
              alt=""
              width="32"
              height="32"
              className="rounded-circle me-2"
            />
            <strong>mdo</strong>
          </a>

          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow"
            aria-labelledby="dropdownUser1"
          >
            <li>
              <a className="dropdown-item" href="#">
                Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Settings
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
