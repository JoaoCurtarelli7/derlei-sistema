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
  InputNumber,
  Select,
  DatePicker,
  Statistic,
  Divider
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import api from '../../lib/api'
import './styles.css'

const { Title, Text } = Typography
const { Option } = Select

export default function Months() {
  const [months, setMonths] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMonth, setEditingMonth] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadMonths()
  }, [])

  const loadMonths = async () => {
    try {
      setLoading(true)
      const response = await api.get('/months')
      setMonths(response.data)
    } catch (error) {
      console.error('Erro ao carregar meses:', error)
      message.error('Erro ao carregar meses')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMonth = async (values) => {
    try {
      await api.post('/months', values)
      message.success('Mês criado com sucesso!')
      setIsModalOpen(false)
      form.resetFields()
      loadMonths()
    } catch (error) {
      console.error('Erro ao criar mês:', error)
      message.error(error.response?.data?.message || 'Erro ao criar mês')
    }
  }

  const handleUpdateMonth = async (values) => {
    try {
      await api.put(`/months/${editingMonth.id}`, values)
      message.success('Mês atualizado com sucesso!')
      setIsModalOpen(false)
      setEditingMonth(null)
      form.resetFields()
      loadMonths()
    } catch (error) {
      console.error('Erro ao atualizar mês:', error)
      message.error('Erro ao atualizar mês')
    }
  }

  const handleDeleteMonth = async (id) => {
    try {
      await api.delete(`/months/${id}`)
      message.success('Mês deletado com sucesso!')
      loadMonths()
    } catch (error) {
      console.error('Erro ao deletar mês:', error)
      message.error(error.response?.data?.message || 'Erro ao deletar mês')
    }
  }

  const handleEdit = (month) => {
    setEditingMonth(month)
    form.setFieldsValue({
      status: month.status
    })
    setIsModalOpen(true)
  }

  const openModal = () => {
    setEditingMonth(null)
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

  const columns = [
    {
      title: 'Mês/Ano',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary">{record.year}/{record.month.toString().padStart(2, '0')}</Text>
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
      title: 'Fechamentos',
      key: 'closings',
      render: (_, record) => (
        <div>
          <Text strong>{record.closings?.length || 0}</Text>
          <br />
          <Text type="secondary">
            {record.closings?.filter(c => c.status === 'fechado').length || 0} fechados
          </Text>
        </div>
      )
    },
    {
      title: 'Criado em',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
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
            onClick={() => window.open(`/closings?monthId=${record.id}`, '_blank')}
            title="Ver fechamentos"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            title="Editar"
          />
          <Popconfirm
            title="Tem certeza que deseja deletar este mês?"
            description="Esta ação não pode ser desfeita."
            onConfirm={() => handleDeleteMonth(record.id)}
            okText="Sim"
            cancelText="Não"
            disabled={record.closings?.length > 0}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.closings?.length > 0}
              title={record.closings?.length > 0 ? "Não é possível deletar mês com fechamentos" : "Deletar"}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="months-container">
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <CalendarOutlined style={{ marginRight: 8 }} />
              Gerenciar Meses
            </Title>
            <Text type="secondary">
              Cadastre e gerencie os meses para o sistema de fechamento
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openModal}
            >
              Novo Mês
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={months}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} meses`
          }}
        />
      </Card>

      <Modal
        title={editingMonth ? 'Editar Mês' : 'Novo Mês'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingMonth(null)
          form.resetFields()
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingMonth ? handleUpdateMonth : handleCreateMonth}
        >
          {!editingMonth && (
            <>
              <Form.Item
                label="Ano"
                name="year"
                rules={[{ required: true, message: 'Ano é obrigatório' }]}
              >
                <InputNumber
                  min={2020}
                  max={2030}
                  style={{ width: '100%' }}
                  placeholder="Ex: 2024"
                />
              </Form.Item>

              <Form.Item
                label="Mês"
                name="month"
                rules={[{ required: true, message: 'Mês é obrigatório' }]}
              >
                <Select placeholder="Selecione o mês">
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthNumber = i + 1
                    const monthNames = [
                      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                    ]
                    return (
                      <Option key={monthNumber} value={monthNumber}>
                        {monthNames[i]} ({monthNumber})
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </>
          )}

          {editingMonth && (
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Status é obrigatório' }]}
            >
              <Select>
                <Option value="aberto">Aberto</Option>
                <Option value="fechado">Fechado</Option>
                <Option value="cancelado">Cancelado</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingMonth ? 'Atualizar' : 'Criar'}
              </Button>
              <Button onClick={() => {
                setIsModalOpen(false)
                setEditingMonth(null)
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
