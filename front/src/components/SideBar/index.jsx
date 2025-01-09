import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import {
  FaHome,
  FaTachometerAlt,
  FaShoppingCart,
  FaBoxes,
  FaUser,
} from 'react-icons/fa'
import SubMenu from 'antd/es/menu/SubMenu'

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

        <Menu mode="vertical" className="bg-dark text-white" theme="dark">
          <Menu.Item key="/" icon={<FaHome className="me-2" />}>
            <Link to="/">Home</Link>

            <SubMenu key="sub1" title="Submenu">
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
              <Menu.Item key="3">Option 3</Menu.Item>
            </SubMenu>
          </Menu.Item>

          <Menu.Item key="/closing" icon={<FaTachometerAlt className="me-2" />}>
            <Link to="/closing">Fechamento</Link>
          </Menu.Item>

          <Menu.Item key="/load" icon={<FaShoppingCart className="me-2" />}>
            <Link to="/load">Carga/Pedidos</Link>
          </Menu.Item>

          <Menu.Item key="/" icon={<FaBoxes className="me-2" />}>
            <Link to="/">Salario</Link>
          </Menu.Item>

          <Menu.Item key="/" icon={<FaUser className="me-2" />}>
            <Link to="/">Manutenção</Link>
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
