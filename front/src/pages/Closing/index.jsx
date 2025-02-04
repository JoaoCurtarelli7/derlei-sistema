import React, { useState } from 'react'
import { Table, Row, Col, Card, Typography, Button } from 'antd'
import * as XLSX from 'xlsx'
import CustomModal from '../../components/Modal/Closing'
import './styles.css'

const { Title } = Typography

export default function Closing() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentType, setCurrentType] = useState('')
  const [entradas, setEntradas] = useState([
    { key: '1', descricao: 'Dequech 1ª Quinzena', valor: 'R$ 0,00' },
    { key: '2', descricao: 'Atac. Joinville 1ª Quinzena', valor: 'R$ 0,00' },
  ])
  const [saidas, setSaidas] = useState([
    { key: '1', descricao: 'Salário Gustavo', valor: 'R$ 13.000,00' },
    { key: '2', descricao: 'Parcela Seguro Caminhão', valor: 'R$ 775,38' },
  ])
  const [impostos, setImpostos] = useState([
    { key: '1', nome: 'FGTS', valor: 'R$ 849,19' },
    { key: '2', nome: 'INSS + Férias', valor: 'R$ 1.330,28' },
  ])
  const [totais, setTotais] = useState({
    totalEntradas: 'R$ 15.000,00',
    totalSaidas: 'R$ 37.772,00',
  })

  const handleAdd = (values) => {
    const newData = { key: Date.now().toString(), ...values }
    const updateState = {
      entrada: () => setEntradas((prev) => [...prev, newData]),
      saida: () => setSaidas((prev) => [...prev, newData]),
      imposto: () => setImpostos((prev) => [...prev, newData]),
    }
    updateState[currentType]?.()
  }

  const openModal = (type) => {
    setCurrentType(type)
    setIsModalOpen(true)
  }

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new()

    const worksheetData = [
      ['ENTRADAS'],
      ['SERVIÇO / ENTRADAS', 'VALOR'],
      ...entradas.map(({ descricao, valor }) => [descricao, valor]),
      [],
      ['SAÍDAS'],
      ['DESPESA', 'VALOR'],
      ...saidas.map(({ descricao, valor }) => [descricao, valor]),
      [],
      ['IMPOSTOS'],
      ['IMPOSTO', 'VALOR'],
      ...impostos.map(({ nome, valor }) => [nome, valor]),
      [],
      ['TOTAIS'],
      ['Total Entradas', totais.totalEntradas],
      ['Total Saídas', totais.totalSaidas],
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fechamento Mensal')
    XLSX.writeFile(workbook, 'FechamentoMensal.xlsx')
  }

  const createColumns = (type) => [
    {
      title: type === 'imposto' ? 'Imposto' : 'Descrição',
      dataIndex: type === 'imposto' ? 'nome' : 'descricao',
      key: 'descricao',
    },
    { title: 'Valor', dataIndex: 'valor', key: 'valor', align: 'right' },
  ]

  return (
    <Card className="closing-card">
      <Title level={2}>Fechamento Mensal</Title>
      <Row gutter={[16, 16]}>
        {[
          { title: 'Entradas', data: entradas, type: 'entrada' },
          { title: 'Saídas', data: saidas, type: 'saida' },
          { title: 'Impostos', data: impostos, type: 'imposto' },
        ].map(({ title, data, type }) => (
          <Col span={12} key={type}>
            <Card
              title={title}
              className={`custom-card ${type}`}
              extra={<Button onClick={() => openModal(type)}>Adicionar</Button>}
            >
              <Table
                dataSource={data}
                columns={createColumns(type)}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        ))}
        <Col span={12}>
          <Card title="Totais" className="custom-card totais">
            <div className="totais-container">
              <Title level={4}>Total Entradas: {totais.totalEntradas}</Title>
              <Title level={4}>Total Saídas: {totais.totalSaidas}</Title>
            </div>
          </Card>
        </Col>
      </Row>
      <div className="action-buttons">
        <Button type="primary" onClick={exportToExcel}>
          Exportar para Excel
        </Button>
      </div>
      <CustomModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAdd}
        title={`Adicionar ${currentType.charAt(0).toUpperCase() + currentType.slice(1)}`}
        type={currentType}
      />
    </Card>
  )
}
