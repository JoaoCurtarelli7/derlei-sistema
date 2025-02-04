import React from 'react'
import { Card, Row, Col, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import empresaLogo1 from '../../../components/assets/empresa_1.png'
import empresaLogo2 from '../../../components/assets/empresa_2.png'
import empresaLogo3 from '../../../components/assets/empresa_3.png'

const { Title } = Typography

export default function LoadCompanies() {
  const navigate = useNavigate()

  const handleCardClick = (id) => {
    console.log(id)
    navigate(`/load/${id}`)
  }

  const companies = [
    {
      id: 1,
      name: 'Empresa A',
      logo: empresaLogo1,
      location: 'São Paulo',
    },
    {
      id: 2,
      name: 'Empresa B',
      logo: empresaLogo2,
      location: 'Rio de Janeiro',
    },
    {
      id: 3,
      name: 'Empresa C',
      logo: empresaLogo3,
      location: 'Belo Horizonte',
    },
  ]

  return (
    <div>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
        Empresas
      </Title>

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
                  src={company.logo}
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
    </div>
  )
}
