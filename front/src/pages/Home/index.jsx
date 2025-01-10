import React from 'react'
import { Card, Row, Col, Typography } from 'antd'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from 'recharts'

const { Title } = Typography

const maintenanceData = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1800 },
  { name: 'Mar', value: 900 },
  { name: 'Apr', value: 1500 },
]

const salaryData = [
  { name: 'Jan', value: 25000 },
  { name: 'Feb', value: 26000 },
  { name: 'Mar', value: 25500 },
  { name: 'Apr', value: 27000 },
]

const cargoData = [
  { name: 'Cargas', value: 75 },
  { name: 'Pedidos', value: 25 },
]

const employeesData = [
  { name: 'Ativos', value: 40 },
  { name: 'Inativos', value: 5 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function Home() {
  return (
    <div style={{ margin: '20px' }}>
      <Title level={2}>Dashboard Geral</Title>
      <Row gutter={16}>
        {/* Gráfico de Manutenção */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Gastos com Manutenção" bordered>
            <BarChart width={300} height={250} data={maintenanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </Card>
        </Col>

        {/* Gráfico de Salário */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Gastos com Salários" bordered>
            <LineChart width={300} height={250} data={salaryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>
          </Card>
        </Col>

        {/* Gráfico de Cargas/Pedidos */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Cargas vs Pedidos" bordered>
            <PieChart width={300} height={250}>
              <Pie
                data={cargoData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {cargoData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        {/* Gráfico de Funcionários */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Funcionários" bordered>
            <PieChart width={300} height={250}>
              <Pie
                data={employeesData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {employeesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </Col>

        {/* Indicador Geral */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Fechamento Mensal" bordered>
            <Title level={4}>Total Receita: R$ 80.000</Title>
            <Title level={4}>Total Despesas: R$ 50.000</Title>
            <Title level={4}>Lucro: R$ 30.000</Title>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
