import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, List, Typography, Space, Divider, message, Select, DatePicker } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import api from '../../../lib/api'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select

export default function Months() {
  const [months, setMonths] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState(dayjs().year())
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMonths()
  }, [])

  const fetchMonths = async () => {
    setLoading(true)
    try {
      const response = await api.get('/months')
      setMonths(response.data)
    } catch (error) {
      message.error('Erro ao carregar meses')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMonth = async () => {
    if (!selectedYear || !selectedMonth) {
      message.warning('Selecione ano e mês')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/months', {
        year: selectedYear,
        month: selectedMonth
      })
      message.success('Mês criado com sucesso!')
      fetchMonths()
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar mês'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigate = (month) => {
    navigate(`/closing`, { state: { monthId: month.id, monthName: month.name } })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          background: '#ffffff',
        }}
        bordered={false}
      >
        <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
          Cadastro de Meses
        </Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              style={{ width: '120px' }}
              placeholder="Ano"
            >
              {Array.from({ length: 10 }, (_, i) => dayjs().year() - 5 + i).map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
            <Select
              value={selectedMonth}
              onChange={setSelectedMonth}
              style={{ width: '150px' }}
              placeholder="Mês"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <Option key={month} value={month}>
                  {dayjs().month(month - 1).format('MMMM')}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddMonth}
              loading={loading}
              style={{ borderRadius: '8px' }}
            >
              Adicionar
            </Button>
          </div>
          <Divider />
          {months.length > 0 ? (
            <List
              dataSource={months}
              bordered={false}
              loading={loading}
              renderItem={(month) => (
                <List.Item
                  style={{
                    borderRadius: '8px',
                    padding: '15px',
                    background: '#f9f9f9',
                    marginBottom: '8px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <Text strong style={{ fontSize: '16px' }}>{month.name}</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {month.closings?.length || 0} fechamentos
                      </Text>
                    </div>
                  </div>
                  <Button
                    type="link"
                    key={month.id}
                    onClick={() => handleNavigate(month)}
                    style={{ color: '#1890ff' }}
                    icon={<ArrowRightOutlined />}
                  >
                    Acessar
                  </Button>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Text type="secondary">Nenhum mês cadastrado ainda.</Text>
            </div>
          )}
        </Space>
      </Card>
    </div>
  )
}
