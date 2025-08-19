import { useEffect, useState } from 'react';
import { Card, Button, Input, Form, Table, Typography, Space, message, Popconfirm } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { api } from '../../../lib';

export default function TripExpenses() {
  const navigate = useNavigate();
  const { state } = useLocation(); // Dados da viagem selecionada
  const [expenses, setExpenses] = useState([]);
  const [form] = Form.useForm();

  const tripId = state?.id;

  // Carregar despesas da viagem
  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/expenses`);
      setExpenses(response.data);
    } catch (error) {
      console.error(error);
      message.error('Erro ao carregar despesas');
    }
  };

  useEffect(() => {
    if (tripId) fetchExpenses();
  }, [tripId]);

  // Adicionar despesa
  const handleAddExpense = async (values) => {
    try {
      const response = await api.post(`/trips/${tripId}/expenses`, values);
      setExpenses((prev) => [...prev, response.data]);
      form.resetFields();
      message.success('Despesa adicionada com sucesso!');
    } catch (error) {
      console.error(error);
      message.error('Erro ao adicionar despesa');
    }
  };

  // Deletar despesa
  const handleDeleteExpense = async (id) => {
    try {
      await api.delete(`/trips/${tripId}/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      message.success('Despesa removida com sucesso!');
    } catch (error) {
      console.error(error);
      message.error('Erro ao remover despesa');
    }
  };

  const calculateTotal = () =>
    expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const freightValue = state?.freightValue || 0;
  const totalExpenses = calculateTotal();
  const profit = freightValue - totalExpenses;

  const columns = [
    { title: 'Descrição', dataIndex: 'description', key: 'description' },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => `R$ ${parseFloat(value).toFixed(2)}`,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Tem certeza de que deseja excluir?"
          onConfirm={() => handleDeleteExpense(record.id)}
          okText="Sim"
          cancelText="Não"
        >
          <Button type="link" danger>
            Excluir
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card
      style={{
        margin: 20,
        padding: 30,
        backgroundColor: '#f7f8fa',
        borderRadius: 16,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
      bordered={false}
    >
      <Typography.Title level={2} style={{ color: '#3b4e6f', marginBottom: 20 }}>
        Gastos da Viagem
      </Typography.Title>
      <Typography.Paragraph style={{ fontSize: 16, color: '#6c757d' }}>
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
      <Form form={form} layout="inline" onFinish={handleAddExpense} style={{ marginBottom: 20 }}>
        <Form.Item
          name="description"
          rules={[{ required: true, message: 'Descrição obrigatória' }]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Descrição do gasto" />
        </Form.Item>
        <Form.Item
          name="amount"
          rules={[
            { required: true, message: 'Valor obrigatório' },
            { pattern: /^\d+(\.\d{1,2})?$/, message: 'Insira um valor válido' },
          ]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Valor (R$)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Adicionar
          </Button>
        </Form.Item>
      </Form>

      {/* Tabela de Gastos */}
      <Table
        dataSource={expenses}
        columns={columns}
        pagination={false}
        rowKey="id"
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

      <Card style={{ marginTop: 20, padding: 20 }} bordered={false}>
        <Typography.Title level={4} style={{ marginBottom: 10 }}>
          Resumo Financeiro
        </Typography.Title>
        <Typography.Paragraph>
          <strong>Lucro Final:</strong>{' '}
          <Typography.Text type="success" style={{ fontSize: 20, color: '#28a745' }}>
            R$ {profit.toFixed(2)}
          </Typography.Text>
        </Typography.Paragraph>
      </Card>

      {/* Botão Voltar */}
      <Space style={{ marginTop: 20 }}>
        <Button type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Space>
    </Card>
  );
}
