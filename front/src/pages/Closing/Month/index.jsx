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
    <Card
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
      bordered={false}
    >
      <Title
        level={2}
        style={{
          textAlign: 'center',
          color: '#1890ff',
          marginBottom: '20px',
        }}
      >
        Cadastro de Meses
      </Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input
            value={newMonth}
            onChange={(e) => setNewMonth(e.target.value)}
            placeholder="Digite o nome do mês (ex: Janeiro 2025)"
            allowClear
            style={{ borderRadius: '8px' }}
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
            bordered
            renderItem={(month) => (
              <List.Item
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  marginBottom: '10px',
                }}
                actions={[
                  <Button
                    type="link"
                    key={month.id}
                    onClick={() => handleNavigate(month)}
                    style={{ color: '#1890ff' }}
                    icon={<ArrowRightOutlined />}
                  >
                    Acessar Fechamento
                  </Button>,
                ]}
              >
                <Text strong>{month.name}</Text>
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
  )
}
