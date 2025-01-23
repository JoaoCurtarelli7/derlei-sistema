import React, { useState } from 'react'
import { Card, Button, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import TripModal from '../../../components/Modal/Trip'

export default function TripList() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([
    {
      key: '1',
      destination: 'São Paulo',
      driver: 'João Silva',
      date: '2025-01-15',
      truck: 'BAP-5053',
      freightValue: 5000, // Adicionando o valor do frete para cada viagem
    },
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleAddTrip = (newTrip) => {
    setTrips((prevTrips) => [
      ...prevTrips,
      { key: Date.now().toString(), ...newTrip },
    ])
    setIsModalVisible(false)
  }

  const columns = [
    {
      title: 'Destino',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: 'Motorista',
      dataIndex: 'driver',
      key: 'driver',
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Caminhão',
      dataIndex: 'truck',
      key: 'truck',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`vehicle/trip-expenses/${record.key}`, { state: record })
          }
        >
          Gastos
        </Button>
      ),
    },
  ]

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <h1>Lista de Viagens</h1>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalVisible(true)}
      >
        Adicionar Viagem
      </Button>
      <Table dataSource={trips} columns={columns} pagination={false} />
      <TripModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddTrip}
      />
    </Card>
  )
}
