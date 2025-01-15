import React, { useState } from 'react';
import { Table, Row, Col, Card, Typography, Button } from 'antd';
import CustomModal from '../../components/Modal/Closing';

const { Title } = Typography;

export default function Closing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState('');
  const [entradas, setEntradas] = useState([
    { key: '1', descricao: 'Dequech 1ª Quinzena', valor: 'R$ 0,00' },
    { key: '2', descricao: 'Atac. Joinville 1ª Quinzena', valor: 'R$ 0,00' },
  ]);
  const [saidas, setSaidas] = useState([
    { key: '1', descricao: 'Salário Gustavo', valor: 'R$ 13.000,00' },
    { key: '2', descricao: 'Parcela Seguro Caminhão', valor: 'R$ 775,38' },
  ]);
  const [impostos, setImpostos] = useState([
    { key: '1', nome: 'FGTS', valor: 'R$ 849,19' },
    { key: '2', nome: 'INSS + Férias', valor: 'R$ 1.330,28' },
  ]);

  const handleAdd = (values) => {
    const newData = { key: Date.now().toString(), ...values };
    if (currentType === 'entrada') setEntradas((prev) => [...prev, newData]);
    if (currentType === 'saida') setSaidas((prev) => [...prev, newData]);
    if (currentType === 'imposto') setImpostos((prev) => [...prev, newData]);
  };

  const openModal = (type) => {
    setCurrentType(type);
    setIsModalOpen(true);
  };

  const colunasEntradas = [
    { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
    { title: 'Valor', dataIndex: 'valor', key: 'valor', align: 'right' },
  ];

  const colunasSaidas = [
    { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
    { title: 'Despesa', dataIndex: 'valor', key: 'valor', align: 'right' },
  ];

  const colunasImpostos = [
    { title: 'Imposto', dataIndex: 'nome', key: 'nome' },
    { title: 'Valor', dataIndex: 'valor', key: 'valor', align: 'right' },
  ];

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <h1>Fechamentos</h1>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            title="Entradas"
            bordered
            extra={<Button onClick={() => openModal('entrada')}>Adicionar</Button>}
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
            bordered
            extra={<Button onClick={() => openModal('saida')}>Adicionar</Button>}
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
          <Card title="Totais" bordered>
            <Title level={4}>Total Saídas: R$ 37.772,00</Title>
            <Title level={4}>Total Entradas: R$ 15.000,00</Title>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Impostos"
            bordered
            extra={<Button onClick={() => openModal('imposto')}>Adicionar</Button>}
          >
            <Table
              dataSource={impostos}
              columns={colunasImpostos}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <CustomModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAdd}
        title={`Adicionar ${currentType === 'entrada' ? 'Entrada' : currentType === 'saida' ? 'Saída' : 'Imposto'}`}
        type={currentType}
      />
    </Card>
  );
}