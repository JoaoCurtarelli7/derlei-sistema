import React, { useState } from 'react'
import { Card, Table, Button, Tag, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import AddEmployeeModal from '../../components/Modal/Employee'

const { Title } = Typography

export default function EmployeeList() {
  const navigate = useNavigate()

  const [data, setData] = useState([
    {
      key: '1',
      nome: 'Robson Silva',
      cargo: 'Motorista',
      salarioBase: 'R$ 2.700,00',
      status: 'Ativo',
    },
    {
      key: '2',
      nome: 'Maria Oliveira',
      cargo: 'Administrativo',
      salarioBase: 'R$ 3.200,00',
      status: 'Ativo',
    },
    {
      key: '3',
      nome: 'Carlos Andrade',
      cargo: 'Técnico',
      salarioBase: 'R$ 2.800,00',
      status: 'Inativo',
    },
  ])

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
    },
    {
      title: 'Salário Base',
      dataIndex: 'salarioBase',
      key: 'salarioBase',
      align: 'right',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        status === 'Ativo' ? (
          <Tag color="green">{status}</Tag>
        ) : (
          <Tag color="red">{status}</Tag>
        ),
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/employee/${record.key}`)}>
          Detalhes
        </Button>
      ),
    },
  ]

  const addEmployee = (newEmployee) => {
    setData((prevData) => [...prevData, newEmployee])
  }

  return (
    <Card
      style={{
        margin: '20px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
      bordered
    >
      <Title level={3} style={{ color: '#333' }}>
        Lista de Funcionários
      </Title>

      <Button type="primary" style={{ marginBottom: '20px' }}>
        <AddEmployeeModal addEmployee={addEmployee} />
      </Button>

      <Table
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 5 }}
        style={{ fontFamily: 'Arial, sans-serif', marginTop: '20px' }}
      />
    </Card>
  )
}
