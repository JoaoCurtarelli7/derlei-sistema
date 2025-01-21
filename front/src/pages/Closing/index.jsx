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
    if (currentType === 'entrada') setEntradas((prev) => [...prev, newData])
    if (currentType === 'saida') setSaidas((prev) => [...prev, newData])
    if (currentType === 'imposto') setImpostos((prev) => [...prev, newData])
  }

  const openModal = (type) => {
    setCurrentType(type)
    setIsModalOpen(true)
  }

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new()

    const worksheetData = [
      // Cabeçalho de Entradas
      [
        {
          v: 'ENTRADAS',
          s: {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: 'center' },
          },
        },
      ],
      ['SERVIÇO / ENTRADAS', 'VALOR'],
      ...entradas.map(({ descricao, valor }) => [descricao, valor]),
      [],

      // Cabeçalho de Saídas
      [
        {
          v: 'SAÍDAS',
          s: {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: 'center' },
          },
        },
      ],
      ['DESPESA', 'VALOR'],
      ...saidas.map(({ descricao, valor }) => [descricao, valor]),
      [],

      // Cabeçalho de Impostos
      [
        {
          v: 'IMPOSTOS',
          s: {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: 'center' },
          },
        },
      ],
      ['IMPOSTO', 'VALOR'],
      ...impostos.map(({ nome, valor }) => [nome, valor]),
      [],

      // Totais
      [
        {
          v: 'TOTAIS',
          s: {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: 'center' },
          },
        },
      ],
      ['Total Entradas', totais.totalEntradas],
      ['Total Saídas', totais.totalSaidas],
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    // Aplicar estilos às células
    Object.keys(worksheet).forEach((cell) => {
      if (cell[0] === '!') return
      worksheet[cell].s = {
        font: { name: 'Arial', sz: 12 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      }

      // Aplicar cores de fundo específicas
      if (cell.startsWith('A1')) {
        worksheet[cell].s.fill = { fgColor: { rgb: 'FFFFCC' } } // Exemplo: amarelo claro
      }
    })

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fechamento Mensal')
    XLSX.writeFile(workbook, 'FechamentoMensal.xlsx')
  }

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
      <Title level={2}>Fechamento Mensal</Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            title="Entradas"
            className="custom-card entradas"
            extra={
              <Button onClick={() => openModal('entrada')}>Adicionar</Button>
            }
          >
            <Table
              dataSource={entradas}
              columns={colunasEntradas}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Saídas"
            className="custom-card saidas"
            extra={
              <Button onClick={() => openModal('saida')}>Adicionar</Button>
            }
          >
            <Table
              dataSource={saidas}
              columns={colunasSaidas}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Impostos"
            className="custom-card impostos"
            extra={
              <Button onClick={() => openModal('imposto')}>Adicionar</Button>
            }
          >
            <Table
              dataSource={impostos}
              columns={colunasImpostos}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Totais" className="custom-card totais">
            <div className="totais-container">
              <Title level={4}>Total Entradas: {totais.totalEntradas}</Title>
              <Title level={4}>Total Saídas: {totais.totalSaidas}</Title>
            </div>
          </Card>
        </Col>
      </Row>

      <Button
        type="primary"
        onClick={exportToExcel}
        style={{ marginTop: '20px' }}
      >
        Exportar para Excel
      </Button>

      <CustomModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAdd}
        title={`Adicionar ${
          currentType === 'entrada'
            ? 'Entrada'
            : currentType === 'saida'
              ? 'Saída'
              : 'Imposto'
        }`}
        type={currentType}
      />
    </Card>
  )
}
