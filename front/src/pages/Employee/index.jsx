import React, { useCallback, useEffect, useState } from 'react'
import { Card, Table, Button, Tag, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import AddEmployeeModal from '../../components/Modal/Employee'
import api from '../../lib/api'
import { FaEdit, FaTrash } from 'react-icons/fa'

const { Title } = Typography

export default function EmployeeList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [editingEmployee, setEditingEmployee] = useState(null)

  // Carrega a lista de funcionários
  useEffect(() => {
    api.get('/employees').then((response) => {
      setData(response.data)
    })
  }, [])

  const addEmployee = (newEmployee) => {
    if (editingEmployee) {
      const updatedData = data.map((employee) =>
        employee.id === newEmployee.id ? newEmployee : employee,
      )
      setData(updatedData)
    } else {
      setData([...data, newEmployee])
    }
  }

  const handleRemove = useCallback(
    (id) => {
      api.delete(`/employees/${id}`).then(() => {
        const updatedData = data.filter((employee) => employee.id !== id)
        setData(updatedData)
        message.success('Funcionário removido com sucesso!')
      })
    },
    [data],
  )

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Cargo',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Salário Base',
      dataIndex: 'baseSalary',
      key: 'baseSalary',
      align: 'right',
      render: (value) => `R$ ${value.toFixed(2)}`,
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
        <>
          <Button
            type="link"
            onClick={() => navigate(`/employee/${record.id}`)}
          >
            Detalhes
          </Button>

          <FaEdit
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => setEditingEmployee(record)}
          />
          <FaTrash
            style={{ cursor: 'pointer' }}
            onClick={() => handleRemove(record.id)}
          />
        </>
      ),
    },
  ]

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

      <AddEmployeeModal
        addEmployee={addEmployee}
        editingEmployee={editingEmployee}
        setEditingEmployee={setEditingEmployee}
      />

      <Table
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 5 }}
        style={{ fontFamily: 'Arial, sans-serif', marginTop: '20px' }}
        rowKey="id"
      />
    </Card>
  )
}
