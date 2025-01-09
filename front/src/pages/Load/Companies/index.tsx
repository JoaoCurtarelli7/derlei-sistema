import React from 'react'
import { Card, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom'

const companies = [
  {
    id: 1,
    name: 'Empresa A',
    logo: 'https://via.placeholder.com/150',
    location: 'São Paulo',
  },
  {
    id: 2,
    name: 'Empresa B',
    logo: 'https://via.placeholder.com/150',
    location: 'Rio de Janeiro',
  },
  {
    id: 3,
    name: 'Empresa C',
    logo: 'https://via.placeholder.com/150',
    location: 'Belo Horizonte',
  },
]

export default function Companies() {
  const navigate = useNavigate()

  const handleCardClick = (id) => {
    console.log(id)

    navigate(`/load/${id}`)
  }

  return (
    <div>
      <h1>Empresas</h1>

      <Row gutter={[20, 16]} justify="center">
        {companies.map((company) => (
          <Col span={4} key={company.id}>
            <Card
              hoverable
              style={{ width: '200px', margin: '10px' }}
              cover={
                <img
                  alt={company.name}
                  src={company.logo}
                  style={{ height: '150px', objectFit: 'cover' }}
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
