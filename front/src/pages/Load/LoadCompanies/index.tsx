import { useEffect, useState } from 'react'
import { Card, Row, Col, Typography, Spin, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AnyObject } from 'antd/es/_util/type'
import { api } from '../../../lib'

const { Title } = Typography

export default function LoadCompanies() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<AnyObject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/company')
      .then((response) => {
        setCompanies(response.data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        message.error('Erro ao carregar empresas. Tente novamente mais tarde.')
        console.error('Error fetching companies:', error)
      })
  }, [])

  const handleCardClick = (id) => {
    navigate(`/load/${id}`)
  }

  return (
    <div>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
        Empresas
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 24]} justify="center">
          {companies.map((company) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={company.id}>
              <Card
                hoverable
                style={{
                  width: '100%',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                  transition: 'transform 0.3s ease-in-out',
                }}
                cover={
                  <img
                    alt={company.name}
                    src={company.logo || 'https://via.placeholder.com/180'}
                    style={{
                      height: '180px',
                      objectFit: 'contain',
                      padding: '15px',
                      borderRadius: '8px',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />
                }
                onClick={() => handleCardClick(company.id)}
              >
                <Card.Meta
                  title={
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {company.name}
                    </div>
                  }
                  description={
                    <div style={{ color: '#777', fontSize: '14px' }}>
                      {company.location}
                    </div>
                  }
                  style={{ textAlign: 'center', padding: '10px 0' }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
