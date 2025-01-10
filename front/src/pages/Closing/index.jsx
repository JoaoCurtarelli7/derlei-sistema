import React from 'react'
import { Table, Row, Col, Card, Typography } from 'antd'

const { Title } = Typography

export default function Closing() {
  // Dados fictícios para renderizar
  const entradas = [
    { key: '1', descricao: 'Dequech 1ª Quinzena', valor: 'R$ 0,00' },
    { key: '2', descricao: 'Atac. Joinville 1ª Quinzena', valor: 'R$ 0,00' },
    // Adicione mais entradas aqui...
  ]

  const saidas = [
    { key: '1', descricao: 'Salário Gustavo', valor: 'R$ 13.000,00' },
    { key: '2', descricao: 'Parcela Seguro Caminhão', valor: 'R$ 775,38' },
    // Adicione mais saídas aqui...
  ]

  const impostos = [
    { key: '1', nome: 'FGTS', valor: 'R$ 849,19' },
    { key: '2', nome: 'INSS + Férias', valor: 'R$ 1.330,28' },
    // Adicione mais impostos aqui...
  ]

  const colunasEntradas = [
    { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
    { title: 'Valor', dataIndex: 'valor', key: 'valor', align: 'right' },
  ]

  const colunasSaidas = [
    { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
    { title: 'Despesa', dataIndex: 'valor', key: 'valor', align: 'right' },
  ]

  const colunasImpostos = [
    { title: 'Imposto', dataIndex: 'nome', key: 'nome' },
    { title: 'Valor', dataIndex: 'valor', key: 'valor', align: 'right' },
  ]

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <h1>Fechamentos</h1>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Entradas" bordered>
            <Table
              dataSource={entradas}
              columns={colunasEntradas}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Saídas */}
        <Col span={12}>
          <Card title="Saídas" bordered>
            <Table
              dataSource={saidas}
              columns={colunasSaidas}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Totais e Impostos */}
        <Col span={12}>
          <Card title="Totais" bordered>
            <Title level={4}>Total Saídas: R$ 37.772,00</Title>
            <Title level={4}>Total Entradas: R$ 15.000,00</Title>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Impostos" bordered>
            <Table
              dataSource={impostos}
              columns={colunasImpostos}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
