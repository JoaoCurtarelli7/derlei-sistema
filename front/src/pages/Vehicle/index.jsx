import React, { useState } from 'react'
import { Card, Button, Row, Col, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import AddVehicleModal from '../../components/Modal/Vehicle'
import caminhaoLogo1 from '../../components/assets/caminhao_1.jfif'
import caminhaoLogo2 from '../../components/assets/caminhao_2.jfif'

export default function VehicleList() {
  const navigate = useNavigate()
  const [data, setData] = useState([
    {
      key: '1',
      nome: 'BAP - 5053',
      placa: 'ABC-1234',
      marca: 'Scania',
      ano: 2020,
      vencimentoDoc: '03/2023',
      renavam: '1090527699',
      imagem: caminhaoLogo1,
    },
    {
      key: '2',
      nome: 'CAM - 3012',
      placa: 'XYZ-5678',
      marca: 'Volvo',
      ano: 2018,
      vencimentoDoc: '08/2024',
      renavam: '2098765432',
      imagem: caminhaoLogo2,
    },
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)

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
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <h1>Lista de Caminhões</h1>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalVisible(true)}
      >
        Adicionar Caminhão
      </Button>

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
                <Button
                  type="link"
                  key={vehicle.key}
                  onClick={() => navigate(`/vehicle/trip`)}
                >
                  Viagens
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
      <AddVehicleModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddVehicle}
      />
    </Card>
  )
}
