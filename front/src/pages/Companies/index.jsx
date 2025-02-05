import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Card, Input, Space, Typography } from 'antd'
import AddCompanyModal from '../../components/Modal/Companies'
import { FaEdit, FaTrash } from 'react-icons/fa'
import api from '../../lib/api'

const { Title } = Typography

export default function CompanyList() {
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null) // Para controlar a empresa que está sendo editada
  const [data, setData] = useState([
    {
      key: '1',
      nome: 'Empresa Alpha',
      tipo: 'TI',
      cnpj: '12.345.678/0001-99',
      dataCadastro: '01/01/2023',
      status: 'Ativo',
      responsavel: 'João',
      comissao: '3',
    },
    {
      key: '2',
      nome: 'Empresa Beta',
      tipo: 'Consultoria',
      cnpj: '98.765.432/0001-88',
      dataCadastro: '15/03/2023',
      status: 'Inativo',
      responsavel: 'Maria',
      comissao: '2',
    },
    {
      key: '3',
      nome: 'Empresa Gamma',
      tipo: 'Educação',
      cnpj: '11.222.333/0001-55',
      dataCadastro: '10/06/2023',
      status: 'Ativo',
      responsavel: 'Carlos',
      comissao: '4',
    },
  ])

  useEffect(() => {
    api.get('/company').then((response) => {
      console.log(response.data)
    })
  }, [])
  useEffect(() => {
    if (searchText) {
      const filtered = data.filter((item) =>
        item.nome.toLowerCase().includes(searchText.toLowerCase()),
      )
      setFilteredData(filtered)
    } else {
      setFilteredData(data)
    }
  }, [searchText, data])

  // Definindo as colunas da tabela
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
      title: 'Comissão',
      dataIndex: 'comissao',
      key: 'comissao',
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
        <>
          <FaEdit
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => handleEdit(record)}
          />

          <FaTrash style={{ cursor: 'pointer' }} />
        </>
      ),
    },
  ]

  const handleEdit = (company) => {
    setEditingCompany(company)
    setIsModalVisible(true)
  }

  return (
    <Card
      style={{
        margin: '20px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
      bordered
    >
      <Title level={3} style={{ color: '#333', marginBottom: '20px' }}>
        Lista de Empresas
      </Title>

      <Space
        style={{ marginBottom: '20px', marginRight: '30px' }}
        direction="vertical"
        size="middle"
      >
        <Input
          placeholder="Pesquisar por nome"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '100%', maxWidth: '300px' }}
        />
      </Space>

      <Button
        type="primary"
        style={{ marginBottom: '20px' }}
        onClick={() => setIsModalVisible(true)}
      >
        Adicionar Empresa
      </Button>

      <Table
        dataSource={searchText ? filteredData : data}
        columns={columns}
        pagination={{ pageSize: 5 }}
        bordered
        style={{ fontFamily: 'Arial, sans-serif' }}
      />

      <AddCompanyModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setData={setData}
        data={data}
        editingCompany={editingCompany}
        setEditingCompany={setEditingCompany}
      />
    </Card>
  )
}
