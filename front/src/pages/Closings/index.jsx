import React, { useState, useEffect } from 'react'
import {
  Table,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Space,
  Tag,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Statistic,
  Divider,
  Alert
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DollarOutlined,
  CalculatorOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import api from '../../lib/api'
import './styles.css'

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

export default function Closings() {
  const [closings, setClosings] = useState([])
  const [months, setMonths] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClosing, setEditingClosing] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadMonths()
    loadCompanies()
  }, [])

  useEffect(() => {
    if (selectedMonth) {
      loadClosings()
    }
  }, [selectedMonth])

  const loadMonths = async () => {
    try {
      const response = await api.get('/months')
      setMonths(response.data)
    } catch (error) {
      console.error('Erro ao carregar meses:', error)
      message.error('Erro ao carregar meses')
    }
  }

  const loadCompanies = async () => {
    try {
      const response = await api.get('/companies')
      setCompanies(response.data)
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
      message.error('Erro ao carregar empresas')
    }
  }

  const loadClosings = async () => {
    if (!selectedMonth) return

    try {
      setLoading(true)
      const response = await api.get(`/closings?monthId=${selectedMonth}`)
      setClosings(response.data)
    } catch (error) {
      console.error('Erro ao carregar fechamentos:', error)
      message.error('Erro ao carregar fechamentos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClosing = async (values) => {
    try {
      await api.post('/closings', {
        ...values,
        monthId: selectedMonth,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD')
      })
      message.success('Fechamento criado com sucesso!')
      setIsModalOpen(false)
      form.resetFields()
      loadClosings()
    } catch (error) {
      console.error('Erro ao criar fechamento:', error)
      message.error(error.response?.data?.message || 'Erro ao criar fechamento')
    }
  }

  const handleUpdateClosing = async (values) => {
    try {
      await api.put(`/closings/${editingClosing.id}`, {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD')
      })
      message.success('Fechamento atualizado com sucesso!')
      setIsModalOpen(false)
      setEditingClosing(null)
      form.resetFields()
      loadClosings()
    } catch (error) {
      console.error('Erro ao atualizar fechamento:', error)
      message.error('Erro ao atualizar fechamento')
    }
  }

  const handleDeleteClosing = async (id) => {
    try {
      await api.delete(`/closings/${id}`)
      message.success('Fechamento deletado com sucesso!')
      loadClosings()
    } catch (error) {
      console.error('Erro ao deletar fechamento:', error)
      message.error(error.response?.data?.message || 'Erro ao deletar fechamento')
    }
  }

  const handleCloseClosing = async (id) => {
    try {
      await api.post(`/closings/${id}/close`)
      message.success('Fechamento fechado com sucesso!')
      loadClosings()
    } catch (error) {
      console.error('Erro ao fechar fechamento:', error)
      message.error('Erro ao fechar fechamento')
    }
  }

  const handleReopenClosing = async (id) => {
    try {
      await api.post(`/closings/${id}/reopen`)
      message.success('Fechamento reaberto com sucesso!')
      loadClosings()
    } catch (error) {
      console.error('Erro ao reabrir fechamento:', error)
      message.error('Erro ao reabrir fechamento')
    }
  }

  const handleEdit = (closing) => {
    setEditingClosing(closing)
    form.setFieldsValue({
      name: closing.name,
      startDate: dayjs(closing.startDate),
      endDate: dayjs(closing.endDate),
      companyId: closing.companyId
    })
    setIsModalOpen(true)
  }

  const openModal = () => {
    setEditingClosing(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'aberto': return 'blue'
      case 'fechado': return 'green'
      case 'cancelado': return 'red'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'aberto': return 'Aberto'
      case 'fechado': return 'Fechado'
      case 'cancelado': return 'Cancelado'
      default: return status
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary">
            {record.company?.name || 'Todas as empresas'}
          </Text>
        </div>
      )
    },
    {
      title: 'Período',
      key: 'period',
      render: (_, record) => (
        <div>
          <Text>{dayjs(record.startDate).format('DD/MM/YYYY')}</Text>
          <br />
          <Text type="secondary">até</Text>
          <br />
          <Text>{dayjs(record.endDate).format('DD/MM/YYYY')}</Text>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Saldo',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right',
      render: (value) => (
        <Text strong style={{ 
          color: value >= 0 ? '#52c41a' : '#ff4d4f' 
        }}>
          {formatCurrency(value)}
        </Text>
      )
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => window.open(`/financial-entries?closingId=${record.id}`, '_blank')}
            title="Ver entradas financeiras"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            disabled={record.status === 'fechado'}
            title="Editar"
          />
          {record.status === 'aberto' ? (
            <Button
              type="text"
              icon={<LockOutlined />}
              size="small"
              onClick={() => handleCloseClosing(record.id)}
              title="Fechar fechamento"
            />
          ) : record.status === 'fechado' ? (
            <Button
              type="text"
              icon={<UnlockOutlined />}
              size="small"
              onClick={() => handleReopenClosing(record.id)}
              title="Reabrir fechamento"
            />
          ) : null}
          <Popconfirm
            title="Tem certeza que deseja deletar este fechamento?"
            description="Esta ação não pode ser desfeita."
            onConfirm={() => handleDeleteClosing(record.id)}
            okText="Sim"
            cancelText="Não"
            disabled={record.status === 'fechado'}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.status === 'fechado'}
              title={record.status === 'fechado' ? "Não é possível deletar fechamento fechado" : "Deletar"}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const selectedMonthData = months.find(m => m.id === selectedMonth)

  return (
    <div className="closings-container">
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <CalculatorOutlined style={{ marginRight: 8 }} />
              Fechamentos
            </Title>
            <Text type="secondary">
              Gerencie os fechamentos financeiros por período
            </Text>
          </Col>
          <Col>
            <Space>
              <Select
                placeholder="Selecione um mês"
                value={selectedMonth}
                onChange={setSelectedMonth}
                style={{ width: 200 }}
              >
                {months.map(month => (
                  <Option key={month.id} value={month.id}>
                    {month.name}
                  </Option>
                ))}
              </Select>
              {selectedMonth && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openModal}
                >
                  Novo Fechamento
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {!selectedMonth && (
          <Alert
            message="Selecione um mês"
            description="Escolha um mês para visualizar e gerenciar os fechamentos."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {selectedMonth && selectedMonthData && (
          <>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Mês Selecionado"
                    value={selectedMonthData.name}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Fechamentos"
                    value={closings.length}
                    prefix={<CalculatorOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Fechados"
                    value={closings.filter(c => c.status === 'fechado').length}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Abertos"
                    value={closings.filter(c => c.status === 'aberto').length}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={closings}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} fechamentos`
              }}
            />
          </>
        )}
      </Card>

      <Modal
        title={editingClosing ? 'Editar Fechamento' : 'Novo Fechamento'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingClosing(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingClosing ? handleUpdateClosing : handleCreateClosing}
        >
          <Form.Item
            label="Nome do Fechamento"
            name="name"
            rules={[{ required: true, message: 'Nome é obrigatório' }]}
          >
            <Input placeholder="Ex: 1ª Quinzena de Janeiro" />
          </Form.Item>

          <Form.Item
            label="Empresa"
            name="companyId"
          >
            <Select placeholder="Selecione uma empresa (opcional)">
              <Option value={null}>Todas as empresas</Option>
              {companies.map(company => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Data Início"
            name="startDate"
            rules={[{ required: true, message: 'Data início é obrigatória' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Selecione a data início"
            />
          </Form.Item>

          <Form.Item
            label="Data Fim"
            name="endDate"
            rules={[{ required: true, message: 'Data fim é obrigatória' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Selecione a data fim"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingClosing ? 'Atualizar' : 'Criar'}
              </Button>
              <Button onClick={() => {
                setIsModalOpen(false)
                setEditingClosing(null)
                form.resetFields()
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
