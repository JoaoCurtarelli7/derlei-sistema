import React from 'react'
import { Card, Table, Row, Col, Typography } from 'antd'
import { useParams } from 'react-router-dom'

const { Title } = Typography

export default function EmployeeDetails() {
  const { id } = useParams() // Recupera o ID do funcionário da URL

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
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <Title level={3}>Detalhes do Funcionário #{id}</Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Créditos">
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
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Débitos">
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
            />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card>
            <Title level={4}>Total a Receber</Title>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 3.570,52</p>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
