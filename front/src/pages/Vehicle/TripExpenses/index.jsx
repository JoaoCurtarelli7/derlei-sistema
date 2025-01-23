import React, { useState } from 'react'
import { Card, Button, Input, Form, Table, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

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
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <Typography.Title level={2}>Gastos da Viagem</Typography.Title>
      <Typography.Paragraph>
        <strong>Destino:</strong> {state?.destination}
        <br />
        <strong>Motorista:</strong> {state?.driver}
        <br />
        <strong>Caminhão:</strong> {state?.truck}
        <br />
        <strong>Valor do Frete:</strong> R$ {freightValue.toFixed(2)}
      </Typography.Paragraph>

      <Form form={form} layout="inline" onFinish={handleAddExpense}>
        <Form.Item
          name="description"
          rules={[{ required: true, message: 'Descrição obrigatória' }]}
        >
          <Input placeholder="Descrição do gasto" />
        </Form.Item>
        <Form.Item
          name="amount"
          rules={[
            { required: true, message: 'Valor obrigatório' },
            { pattern: /^\d+(\.\d{1,2})?$/, message: 'Insira um valor válido' },
          ]}
        >
          <Input placeholder="Valor (R$)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Adicionar
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={expenses}
        columns={columns}
        pagination={false}
        style={{ marginTop: 20 }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell>Total</Table.Summary.Cell>
            <Table.Summary.Cell>
              <Typography.Text strong>
                R$ {totalExpenses.toFixed(2)}
              </Typography.Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Typography.Title level={4} style={{ marginTop: 20 }}>
        Lucro Final: R$ {profit.toFixed(2)}
      </Typography.Title>

      <Button
        type="default"
        style={{ marginTop: 16 }}
        onClick={() => navigate(-1)}
      >
        Voltar
      </Button>
    </Card>
  )
}
