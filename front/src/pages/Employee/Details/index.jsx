import React from 'react'
import { Card, Table, Row, Col, Typography } from 'antd'
import { useParams } from 'react-router-dom'

const { Title } = Typography

export default function EmployeeDetails() {
  const { id } = useParams() // Get employee ID from the URL

  const credits = [
    { key: '1', descricao: 'Salário Base do Mês', valor: 'R$ 2.700,00' },
    { key: '2', descricao: 'Despesa Alimentação', valor: 'R$ 700,00' },
    { key: '3', descricao: 'Extras e Ajuda de Custo', valor: 'R$ 450,00' },
  ]

  const debits = [
    { key: '1', descricao: 'Imposto de Renda', valor: 'R$ 17,88' },
    { key: '2', descricao: 'Amaciante Dequech', valor: 'R$ 26,60' },
    { key: '3', descricao: 'Despesa Cerveja 30/11', valor: 'R$ 30,00' },
  ]

  return (
    <div style={{}}>
      <Card
        style={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        bordered
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: '30px' }}>
          Detalhes do Funcionário #{id}
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card title="Créditos" bordered>
              <Table
                dataSource={credits}
                columns={[
                  {
                    title: 'Descrição',
                    dataIndex: 'descricao',
                    key: 'descricao',
                  },
                  {
                    title: 'Valor',
                    dataIndex: 'valor',
                    key: 'valor',
                    align: 'right',
                  },
                ]}
                pagination={false}
                size="small"
                style={{ marginBottom: '15px' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card title="Débitos" bordered>
              <Table
                dataSource={debits}
                columns={[
                  {
                    title: 'Descrição',
                    dataIndex: 'descricao',
                    key: 'descricao',
                  },
                  {
                    title: 'Valor',
                    dataIndex: 'valor',
                    key: 'valor',
                    align: 'right',
                  },
                ]}
                pagination={false}
                size="small"
                style={{ marginBottom: '15px' }}
              />
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: '20px' }}>
          <Col xs={24} sm={12}>
            <Card
              bordered
              style={{
                padding: '15px',
                textAlign: 'center',
                backgroundColor: '#f7f7f7',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Title level={4}>Total a Receber</Title>
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#4CAF50',
                }}
              >
                R$ 3,570.52
              </p>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
