import React from 'react'
import { Card, Table, Typography } from 'antd'
import { useParams } from 'react-router-dom'

const { Title } = Typography

export default function VehicleMaintenance() {
  const { id } = useParams()

  const maintenanceData = [
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
  ]

  // Calcula o total de gastos
  const totalGasto = maintenanceData.reduce((acc, curr) => acc + curr.valor, 0)

  const columns = [
    { title: 'Data', dataIndex: 'data', key: 'data' },
    { title: 'Serviço Realizado', dataIndex: 'servico', key: 'servico' },
    { title: 'KM', dataIndex: 'km', key: 'km', align: 'right' },
    { title: 'Valor (R$)', dataIndex: 'valor', key: 'valor', align: 'right' },
  ]

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <Title level={3}>Manutenção do Caminhão #{id}</Title>
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
    </Card>
  )
}
