import { Col, Image, Row } from 'antd'
import { Link } from 'react-router-dom'
import logoImage from '../../components/assets/avhro.png'
import './styles.less'

const menuItems = [
  { path: '/', label: 'Home' },
  { path: '/donor', label: 'Doadores' },
  { path: '/donatary', label: 'Donatários' },
  { path: '/', label: 'Famílias' },
  { path: '/', label: 'Doações Recebidas' },
  { path: '/', label: 'Doações Entregues' },
]

export default function HeaderPages() {
  return (
    <Row gutter={[20, 16]} className="header2">
      <Col span={6} offset={1}>
        <div className="logo-container">
          <Image
            src={logoImage}
            alt="AVHRO Logo"
            preview={false}
            className="logo-image"
          />
          <span className="subtitle-logo">AVHRO</span>
        </div>
      </Col>

      {menuItems.map((item, index) => (
        <Col key={index} className="nav-menu">
          <Link to={item.path}>{item.label}</Link>
        </Col>
      ))}
    </Row>
  )
}
