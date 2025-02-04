import React, { useState } from 'react'
import { Card, Button, Table, Typography, Space, Popconfirm } from 'antd'
import TripModal from '../../../components/Modal/Trip'
import { PlusCircleOutlined } from '@ant-design/icons'
import { FaTrash } from 'react-icons/fa6'
import { FaDollarSign, FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

export default function TripList() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([
    {
      key: '1',
      destination: 'São Paulo',
      driver: 'João Silva',
      date: '2025-01-15',
      truck: 'BAP-5053',
      freightValue: 5000,
    },
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentTrip, setCurrentTrip] = useState(null)

  const handleAddTrip = (newTrip) => {
    setTrips((prevTrips) => [
      ...prevTrips,
      { key: Date.now().toString(), ...newTrip },
    ])
    setIsModalVisible(false)
  }

  const handleEditTrip = (trip) => {
    setCurrentTrip(trip)
    setIsModalVisible(true)
  }

  const handleDeleteTrip = (key) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.key !== key))
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
        <>
          <FaDollarSign
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() =>
              navigate(`/vehicle/trip-expenses/${record.key}`, {
                state: record,
              })
            }
          />

          <FaEdit
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => handleEditTrip(record)}
          />

          <Popconfirm
            title="Tem certeza de que deseja excluir?"
            onConfirm={() => handleDeleteTrip(record.key)}
            okText="Sim"
            cancelText="Não"
          >
            <FaTrash style={{ cursor: 'pointer' }} />
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={2}>Lista de Viagens</Title>

        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          icon={<PlusCircleOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Adicionar Viagem
        </Button>

        <Table
          dataSource={trips}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="key"
        />

        <TripModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleAddTrip}
          initialValues={currentTrip}
        />
      </Space>
    </Card>
  )
}
