import React, { useState } from 'react'
import { Card, Button, Input, Form, Table, Typography, Space } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'

export default function TripExpenses() {
  const navigate = useNavigate()
  const { state } = useLocation() // Recebe os dados da viagem selecionada
  const [expenses, setExpenses] = useState([])
  const [form] = Form.useForm()

  const handleAddExpense = (values) => {
    setExpenses((prevExpenses) => [
      ...prevExpenses,
      { key: Date.now().toString(), ...values },
    ])
    form.resetFields()
  }

  const calculateTotal = () =>
    expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0)

  const freightValue = state?.freightValue || 0 // Valor do frete vindo da viagem
  const totalExpenses = calculateTotal()
  const profit = freightValue - totalExpenses

  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => `R$ ${parseFloat(value).toFixed(2)}`,
    },
  ]

  return (
    <Card
      style={{
        margin: '20px',
        padding: '30px',
        backgroundColor: '#f7f8fa',
        borderRadius: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
      bordered={false}
    >
      <Typography.Title
        level={2}
        style={{ color: '#3b4e6f', marginBottom: '20px' }}
      >
        Gastos da Viagem
      </Typography.Title>
      <Typography.Paragraph style={{ fontSize: '16px', color: '#6c757d' }}>
        <strong>Destino:</strong> {state?.destination}
        <br />
        <strong>Motorista:</strong> {state?.driver}
        <br />
        <strong>Caminhão:</strong> {state?.truck}
        <br />
        <strong>Valor do Frete:</strong>{' '}
        <Typography.Text strong style={{ color: '#28a745' }}>
          R$ {freightValue.toFixed(2)}
        </Typography.Text>
      </Typography.Paragraph>

      {/* Formulário para adicionar gastos */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleAddExpense}
        style={{ marginBottom: '20px' }}
      >
        <Form.Item
          name="description"
          rules={[{ required: true, message: 'Descrição obrigatória' }]}
          style={{ flex: 1 }}
        >
          <Input
            placeholder="Descrição do gasto"
            style={{
              borderRadius: '8px',
              padding: '10px',
              border: '1px solid #ced4da',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          rules={[
            { required: true, message: 'Valor obrigatório' },
            { pattern: /^\d+(\.\d{1,2})?$/, message: 'Insira um valor válido' },
          ]}
          style={{ flex: 1 }}
        >
          <Input
            placeholder="Valor (R$)"
            style={{
              borderRadius: '8px',
              padding: '10px',
              border: '1px solid #ced4da',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            style={{
              backgroundColor: '#007bff',
              borderRadius: '8px',
              borderColor: '#007bff',
              color: 'white',
            }}
          >
            Adicionar
          </Button>
        </Form.Item>
      </Form>

      {/* Tabela de Gastos */}
      <Table
        dataSource={expenses}
        columns={columns}
        pagination={false}
        style={{
          marginBottom: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        rowKey="key"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell>Total</Table.Summary.Cell>
            <Table.Summary.Cell>
              <Typography.Text strong style={{ color: '#28a745' }}>
                R$ {totalExpenses.toFixed(2)}
              </Typography.Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Card
        style={{
          backgroundColor: '#ffffff',
          marginTop: '20px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        bordered={false}
      >
        <Typography.Title
          level={4}
          style={{ marginBottom: '10px', color: '#333' }}
        >
          Resumo Financeiro
        </Typography.Title>
        <Typography.Paragraph>
          <strong>Lucro Final:</strong>
          <Typography.Text
            type="success"
            style={{ fontSize: '20px', color: '#28a745' }}
          >
            {` R$ ${profit.toFixed(2)}`}
          </Typography.Text>
        </Typography.Paragraph>
      </Card>

      {/* Botão Voltar */}
      <Space style={{ marginTop: '20px' }}>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderColor: '#dee2e6',
            color: '#6c757d',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Voltar
        </Button>
      </Space>
    </Card>
  )
}
