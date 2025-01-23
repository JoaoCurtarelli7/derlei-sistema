import React from 'react'
import { Card, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom'
import empresaLogo1 from '../../../components/assets/empresa_1.png'
import empresaLogo2 from '../../../components/assets/empresa_2.png'
import empresaLogo3 from '../../../components/assets/empresa_3.png'

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
      <h1>Empresas</h1>

      <Row gutter={[20, 16]} justify="center">
        {companies.map((company) => (
          <Col span={4} offset={1} key={company.id}>
            <Card
              hoverable
              style={{
                width: '200px',
                margin: '10px',
                border: '2px solid rgb(120, 145, 222)',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              cover={
                <img
                  alt={company.name}
                  src={company.logo}
                  style={{
                    height: '150px',
                    objectFit: 'cover',
                    padding: '10px',
                  }}
                />
              }
              onClick={() => handleCardClick(company.id)}
            >
              <Card.Meta
                title={company.name}
                description={company.location}
                style={{ textAlign: 'center' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
