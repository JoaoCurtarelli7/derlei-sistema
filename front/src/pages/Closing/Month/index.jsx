import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, List, Typography, Space, Divider } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function Months() {
  const [months, setMonths] = useState([])
  const [newMonth, setNewMonth] = useState('')
  const navigate = useNavigate()

  const handleAddMonth = () => {
    if (newMonth.trim()) {
      setMonths([...months, { id: Date.now(), name: newMonth }])
      setNewMonth('')
    }
  }

  const handleNavigate = (month) => {
    navigate(`/closing`, { state: { monthName: month.name } })
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
            <Input
              value={newMonth}
              onChange={(e) => setNewMonth(e.target.value)}
              placeholder="Digite o nome do mês (ex: Janeiro 2025)"
              allowClear
              style={{ borderRadius: '8px', flex: 1 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddMonth}
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
              renderItem={(month) => (
                <List.Item
                  style={{
                    borderRadius: '8px',
                    padding: '10px 15px',
                    background: '#f9f9f9',
                    marginBottom: '8px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text strong>{month.name}</Text>
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
