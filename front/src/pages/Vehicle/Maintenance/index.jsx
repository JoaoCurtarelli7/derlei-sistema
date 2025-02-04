import React, { useState } from 'react'
import { Card, Table, Typography, Button, message } from 'antd'
import { useParams } from 'react-router-dom'
import VehicleMaintenanceModal from '../../../components/Modal/MainTenanceVehicle'
import { FaEdit, FaTrash } from 'react-icons/fa'

const { Title } = Typography

export default function VehicleMaintenanceList() {
  const { id } = useParams()
  const [maintenanceData, setMaintenanceData] = useState([
    {
      key: '1',
      data: '18/08/2021',
      servico: 'Troca água e aditivo',
      km: 207807,
      valor: 150.0,
    },
    {
      key: '2',
      data: '15/09/2021',
      servico: 'Troca lonas traseiras',
      km: 207807,
      valor: 400.0,
    },
    {
      key: '3',
      data: '27/11/2021',
      servico: 'Troca óleo motor',
      km: 241947,
      valor: 350.0,
    },
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState(null) // Track the maintenance being edited

  const totalGasto = maintenanceData.reduce((acc, curr) => acc + curr.valor, 0)

  const columns = [
    { title: 'Data', dataIndex: 'data', key: 'data' },
    { title: 'Serviço Realizado', dataIndex: 'servico', key: 'servico' },
    { title: 'KM', dataIndex: 'km', key: 'km', align: 'right' },
    { title: 'Valor (R$)', dataIndex: 'valor', key: 'valor', align: 'right' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <>
          <FaEdit
            onClick={() => handleEdit(record)}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          />
          <FaTrash
            onClick={() => handleDelete(record.key)}
            style={{ cursor: 'pointer' }}
          />
        </>
      ),
    },
  ]

  const handleAddMaintenance = (values) => {
    const newMaintenance = {
      key: Date.now().toString(),
      ...values,
    }
    setMaintenanceData((prevData) => [...prevData, newMaintenance])
    setIsModalVisible(false)
    message.success('Manutenção adicionada com sucesso!')
  }

  const handleEdit = (record) => {
    setEditingMaintenance(record) // Set the maintenance to be edited
    setIsModalVisible(true) // Show the modal
  }

  const handleDelete = (key) => {
    setMaintenanceData(maintenanceData.filter((item) => item.key !== key))
    message.success('Manutenção removida com sucesso!')
  }

  const handleEditMaintenance = (values) => {
    const updatedData = maintenanceData.map((item) =>
      item.key === editingMaintenance.key ? { ...item, ...values } : item,
    )
    setMaintenanceData(updatedData)
    setIsModalVisible(false)
    setEditingMaintenance(null)
    message.success('Manutenção atualizada com sucesso!')
  }

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <Title level={3}>Manutenção do Caminhão #{id}</Title>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalVisible(true)}
      >
        Adicionar Manutenção
      </Button>

      <Table
        dataSource={maintenanceData}
        columns={columns}
        pagination={{ pageSize: 5 }}
        footer={() => (
          <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
            Total Gasto: R$ {totalGasto.toFixed(2)}
          </div>
        )}
      />

      <VehicleMaintenanceModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onAddMaintenance={handleAddMaintenance}
        onEditMaintenance={handleEditMaintenance}
        editingMaintenance={editingMaintenance} // Pass the editing maintenance to the modal
      />
    </Card>
  )
}
