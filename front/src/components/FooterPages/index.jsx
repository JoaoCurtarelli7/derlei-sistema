import { Col, Divider, Row } from 'antd'
import './styles.less'

export default function FooterPages() {
  return (
    <>
      <div className="footer-content"></div>
      <div className="footer-text">
        <Col span={22} offset={1}>
          <Divider plain className="thicker-divider" />
        </Col>

        <Row justify="center" align="middle">
          <Col span={24}>
            <p>
              © 2024 - Desenvolvido por: <a href="#">Piazada 1.0</a>
            </p>
          </Col>
        </Row>
      </div>
    </>
  )
}
