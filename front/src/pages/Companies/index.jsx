import React, { useState } from 'react'
import { Table, Tag, Button, Card } from 'antd'

export default function CompanyList() {
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const data = [
    {
      key: '1',
      nome: 'Empresa Alpha',
      tipo: 'TI',
      cnpj: '12.345.678/0001-99',
      dataCadastro: '01/01/2023',
      status: 'Ativo',
      responsavel: 'João',
    },
    {
      key: '2',
      nome: 'Empresa Beta',
      tipo: 'Consultoria',
      cnpj: '98.765.432/0001-88',
      dataCadastro: '15/03/2023',
      status: 'Inativo',
      responsavel: 'Maria',
    },
    {
      key: '3',
      nome: 'Empresa Gamma',
      tipo: 'Educação',
      cnpj: '11.222.333/0001-55',
      dataCadastro: '10/06/2023',
      status: 'Ativo',
      responsavel: 'Carlos',
    },
  ]

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a, b) => a.nome.localeCompare(b.nome),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      sorter: (a, b) => a.tipo.localeCompare(b.tipo),
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'cnpj',
    },
    {
      title: 'Data de Cadastro',
      dataIndex: 'dataCadastro',
      key: 'dataCadastro',
      sorter: (a, b) => new Date(a.dataCadastro) - new Date(b.dataCadastro),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        status === 'Ativo' ? (
          <Tag color="green">{status}</Tag>
        ) : (
          <Tag color="red">{status}</Tag>
        ),
    },
    {
      title: 'Responsável',
      dataIndex: 'responsavel',
      key: 'responsavel',
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, record) => (
        <Button type="link" onClick={() => alert(`Detalhes de ${record.nome}`)}>
          Detalhes
        </Button>
      ),
    },
  ]

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <h1>Lista de Empresas</h1>
      <Table
        dataSource={searchText ? filteredData : data}
        columns={columns}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </Card>
  )
}
