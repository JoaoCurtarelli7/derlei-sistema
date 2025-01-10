import React from 'react'
import { Card, Table, Button, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function EmployeeList() {
  const navigate = useNavigate()

  const data = [
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
  ]

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

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <h1>Lista de Funcionários</h1>
      <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />
    </Card>
  )
}
