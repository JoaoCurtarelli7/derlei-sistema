import React, { useEffect, useState } from 'react'
import { Card, Table } from 'antd'
import { useParams } from 'react-router-dom'

// const { Title } = Typography

export default function Load() {
  const { id } = useParams() // Recupera o id da empresa da URL
  const [data, setData] = useState([])

  useEffect(() => {
    const companyData = [
      {
        key: '1',
        data: '12/4/2024',
        numeroCarregamento: '578656',
        entregas: 1,
        pesoCarga: '8077,07',
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
        pesoCarga: '272,78',
        valorTotal: 'R$ 272,78',
        frete4: 'R$ 10,91',
        somaTotalFrete: 'R$ 333,99',
        fechamentos: 'R$ 0,00',
        observacoes: '',
      },
    ]
    setData(companyData)
  }, [id])

  const columns = [
    { title: 'Data', dataIndex: 'data', key: 'data', align: 'center' },
    {
      title: 'Número do Carregamento',
      dataIndex: 'numeroCarregamento',
      key: 'numeroCarregamento',
      align: 'center',
    },
    {
      title: 'Quantidade de Entregas',
      dataIndex: 'entregas',
      key: 'entregas',
      align: 'center',
    },
    {
      title: 'Peso da Carga',
      dataIndex: 'pesoCarga',
      key: 'pesoCarga',
      align: 'center',
    },
    {
      title: 'Valor Total',
      dataIndex: 'valorTotal',
      key: 'valorTotal',
      align: 'right',
    },
    {
      title: 'Valor do Frete 4%',
      dataIndex: 'frete4',
      key: 'frete4',
      align: 'right',
    },
    {
      title: 'Soma Total Frete',
      dataIndex: 'somaTotalFrete',
      key: 'somaTotalFrete',
      align: 'right',
    },
    {
      title: 'Fechamentos (De Quinzena)',
      dataIndex: 'fechamentos',
      key: 'fechamentos',
      align: 'right',
    },
    {
      title: 'Observações',
      dataIndex: 'observacoes',
      key: 'observacoes',
      align: 'left',
    },
  ]
  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <h1>Tabela da Empresa {id}</h1>
      <Table dataSource={data} columns={columns} />
    </Card>
  )
}
