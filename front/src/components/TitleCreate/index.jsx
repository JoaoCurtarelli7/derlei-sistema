import { faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import './styles.less'

function TitleCreateList({ textTitle, route, create }) {
  const navigate = useNavigate()

  return (
    <Row
      gutter={[20, 16]}
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <Col span={22}>
        <div className="title-table">
          <span className="content-title">{textTitle}</span>

          <Col
            span={19}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <span className="add-icon" onClick={() => navigate(route)}>
              <FontAwesomeIcon
                icon={create ? faChevronLeft : faPlus}
                size="2x"
              />
            </span>
          </Col>
        </div>
      </Col>
    </Row>
  )
}

export default TitleCreateList
