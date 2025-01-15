import React, { useEffect, useState } from 'react';
import { Card, Table, Button } from 'antd';
import { useParams } from 'react-router-dom';
import CustomModalLoad from '../../components/Modal/Load';

export default function Load() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const companyData = [
      {
        key: '1',
        data: '12/4/2024',
        numeroCarregamento: '578656',
        entregas: 1,
        pesoCarga: 8077.07,
        valorTotal: 'R$ 8.077,07',
        frete4: 'R$ 323,08',
        somaTotalFrete: 'R$ 323,08',
        fechamentos: 'R$ 0,00',
        observacoes: '',
      },
      {
        key: '2',
        data: '12/4/2024',
        numeroCarregamento: '578658',
        entregas: 1,
        pesoCarga: 272.78,
        valorTotal: 'R$ 272,78',
        frete4: 'R$ 10,91',
        somaTotalFrete: 'R$ 333,99',
        fechamentos: 'R$ 0,00',
        observacoes: '',
      },
    ];
    setData(companyData);
  }, [id]);

  const handleAddLoad = (newLoad) => {
    const newData = {
      key: Date.now().toString(),
      ...newLoad,
      valorTotal: `R$ ${newLoad.valorTotal.toFixed(2).replace('.', ',')}`,
      frete4: `R$ ${newLoad.frete4.toFixed(2).replace('.', ',')}`,
      somaTotalFrete: `R$ ${newLoad.somaTotalFrete.toFixed(2).replace('.', ',')}`,
      fechamentos: `R$ ${newLoad.fechamentos.toFixed(2).replace('.', ',')}`,
    };
    setData((prev) => [...prev, newData]);
    setIsModalOpen(false);
  };

  const columns = [
    { title: 'Data', dataIndex: 'data', key: 'data', align: 'center' },
    { title: 'Número do Carregamento', dataIndex: 'numeroCarregamento', key: 'numeroCarregamento', align: 'center' },
    { title: 'Quantidade de Entregas', dataIndex: 'entregas', key: 'entregas', align: 'center' },
    { title: 'Peso da Carga', dataIndex: 'pesoCarga', key: 'pesoCarga', align: 'center' },
    { title: 'Valor Total', dataIndex: 'valorTotal', key: 'valorTotal', align: 'right' },
    { title: 'Valor do Frete 4%', dataIndex: 'frete4', key: 'frete4', align: 'right' },
    { title: 'Soma Total Frete', dataIndex: 'somaTotalFrete', key: 'somaTotalFrete', align: 'right' },
    { title: 'Fechamentos', dataIndex: 'fechamentos', key: 'fechamentos', align: 'right' },
    { title: 'Observações', dataIndex: 'observacoes', key: 'observacoes', align: 'left' },
  ];

  const calculateTotalFreight = () => {
    return data
      .map((item) => parseFloat(item.somaTotalFrete.replace(/[^\d,]/g, '').replace(',', '.')))
      .reduce((sum, value) => sum + value, 0);
  };

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <h1>Tabela da Empresa {id}</h1>

      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Adicionar Carregamento
      </Button>

      <Table
        dataSource={data}
        add
        columns={columns}
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={6}>
              <strong>Total Soma Frete:</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6} align="right">
              <strong>
                R$ {calculateTotalFreight().toFixed(2).replace('.', ',')}
              </strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={7} colSpan={2} />
          </Table.Summary.Row>
        )}
      />

      <CustomModalLoad
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLoad}
      />
    </Card>
  );
}
