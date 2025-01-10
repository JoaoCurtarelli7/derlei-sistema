import React from 'react'
import { Card, Button, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function VehicleList() {
  const navigate = useNavigate()

  const data = [
    {
      key: '1',
      nome: 'BAP - 5053',
      placa: 'ABC-1234',
      marca: 'Scania',
      ano: 2020,
      vencimentoDoc: '03/2023',
      renavam: '1090527699',
      imagem: 'https://via.placeholder.com/150?text=Scania+BAP', // Substitua pelo link real da imagem
    },
    {
      key: '2',
      nome: 'CAM - 3012',
      placa: 'XYZ-5678',
      marca: 'Volvo',
      ano: 2018,
      vencimentoDoc: '08/2024',
      renavam: '2098765432',
      imagem: 'https://via.placeholder.com/150?text=Volvo+CAM', // Substitua pelo link real da imagem
    },
  ]

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <h1>Lista de Caminhões</h1>
      <Row gutter={[16, 16]}>
        {data.map((vehicle) => (
          <Col xs={24} sm={12} md={8} lg={6} key={vehicle.key}>
            <Card
              cover={
                <img
                  alt={vehicle.nome}
                  src={vehicle.imagem}
                  style={{ height: '150px', objectFit: 'cover' }}
                />
              }
              actions={[
                <Button
                  type="link"
                  key={vehicle.key}
                  onClick={() =>
                    navigate(`/vehicle-maintenance/${vehicle.key}`)
                  }
                >
                  Manutenção
                </Button>,
              ]}
            >
              <Card.Meta
                title={vehicle.nome}
                description={
                  <>
                    <p>Placa: {vehicle.placa}</p>
                    <p>Marca: {vehicle.marca}</p>
                    <p>Ano: {vehicle.ano}</p>
                    <p>Venc. Doc.: {vehicle.vencimentoDoc}</p>
                    <p>Renavam: {vehicle.renavam}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  )
}
