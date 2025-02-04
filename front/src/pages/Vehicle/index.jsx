import React, { useState } from 'react'
import { Card, Button, Row, Col, message, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import caminhaoLogo1 from '../../components/assets/caminhao_1.jfif'
import caminhaoLogo2 from '../../components/assets/caminhao_2.jfif'
import AddVehicleModal from '../../components/Modal/Vehicle'

const { Title } = Typography

export default function VehicleList() {
  const navigate = useNavigate()
  const [data, setData] = useState([
    {
      key: '1',
      nome: 'Scania',
      placa: 'ABC-1234',
      marca: 'Scania',
      ano: 2020,
      vencimentoDoc: '03/2023',
      renavam: '1090527699',
      imagem: caminhaoLogo1,
    },
    {
      key: '2',
      nome: 'Volvo',
      placa: 'XYZ-5678',
      marca: 'Volvo',
      ano: 2018,
      vencimentoDoc: '08/2024',
      renavam: '2098765432',
      imagem: caminhaoLogo2,
    },
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentVehicle, setCurrentVehicle] = useState(null)

  const handleAddVehicle = (values) => {
    const newVehicle = {
      key: Date.now().toString(),
      ...values,
      imagem:
        values.imagem?.file?.response?.url ||
        'https://via.placeholder.com/150?text=Novo+Caminhao',
    }
    setData((prevData) => [...prevData, newVehicle])
    setIsModalVisible(false)
    message.success('Caminhão adicionado com sucesso!')
  }

  return (
    <Card
      style={{
        margin: '20px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
      }}
      bordered={false}
    >
      <Title level={3} style={{ color: '#333', marginBottom: '20px' }}>
        Lista de Caminhões
      </Title>

      <Button
        type="primary"
        style={{
          marginBottom: 16,
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
          fontSize: '16px',
        }}
        onClick={() => {
          setCurrentVehicle(null)
          setIsModalVisible(true)
        }}
      >
        Adicionar Caminhão
      </Button>

      <Row gutter={[16, 16]}>
        {data.map((vehicle) => (
          <Col xs={24} sm={12} md={8} lg={6} key={vehicle.key}>
            <Card
              hoverable
              cover={
                <img
                  alt={vehicle.nome}
                  src={vehicle.imagem}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '10px',
                  }}
                />
              }
              actions={[
                <Button
                  type="link"
                  key={vehicle.key}
                  onClick={() =>
                    navigate(`/vehicle-maintenance/${vehicle.key}`)
                  }
                  style={{ color: '#1890ff' }}
                >
                  Manutenção
                </Button>,
                <Button
                  type="link"
                  key={vehicle.key}
                  onClick={() => navigate(`/vehicle/trip`)}
                  style={{ color: '#1890ff' }}
                >
                  Viagens
                </Button>,
              ]}
              style={{
                borderRadius: '10px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Card.Meta
                title={<strong>{vehicle.nome}</strong>}
                description={
                  <div style={{ fontSize: '14px' }}>
                    <p>
                      <strong>Placa:</strong> {vehicle.placa}
                    </p>
                    <p>
                      <strong>Marca:</strong> {vehicle.marca}
                    </p>
                    <p>
                      <strong>Ano:</strong> {vehicle.ano}
                    </p>
                    <p>
                      <strong>Venc. Doc.:</strong> {vehicle.vencimentoDoc}
                    </p>
                    <p>
                      <strong>Renavam:</strong> {vehicle.renavam}
                    </p>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <AddVehicleModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddVehicle}
        vehicle={currentVehicle}
      />
    </Card>
  )
}
