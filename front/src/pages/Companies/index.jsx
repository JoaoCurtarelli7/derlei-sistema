import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Table,
  Tag,
  Button,
  Card,
  Input,
  Space,
  Typography,
  message,
} from 'antd'
import AddCompanyModal from '../../components/Modal/Companies'
import { FaEdit, FaTrash } from 'react-icons/fa'
import api from '../../lib/api'

const { Title } = Typography

export default function CompanyList() {
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null) 
  const [data, setData] = useState([])

  useEffect(() => {
    api.get('/company').then((response) => {
      setData(response.data)
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

  const handleEdit = useCallback((company) => {
    setEditingCompany(company)
    setIsModalVisible(true)
  }, [])

  const handleRemove = useCallback(
    (id) => {
      api.delete(`/company/${id}`).then(() => {
        const updatedData = data.filter((company) => company.id !== id)
        setData(updatedData)
        setIsModalVisible(false)
        setEditingCompany(null)
        message.success('Empresa removida com sucesso!')
      })
    },
    [data],
  )

  const columns = useMemo(
    () => [
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Tipo',
        dataIndex: 'type',
        key: 'type',
        sorter: (a, b) => a.type.localeCompare(b.type),
      },
      {
        title: 'CNPJ',
        dataIndex: 'cnpj',
        key: 'cnpj',
      },
      {
        title: 'Data de Cadastro',
        dataIndex: 'dateRegistration',
        key: 'dateRegistration',
        render: (dateRegistration) =>
          new Date(dateRegistration).toLocaleDateString(),
        sorter: (a, b) =>
          new Date(a.dateRegistration) - new Date(b.dateRegistration),
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
        dataIndex: 'commission',
        key: 'commission',
      },
      {
        title: 'Responsável',
        dataIndex: 'responsible',
        key: 'responsible',
      },
      {
        title: 'Ações',
        render: (_, record) => (
          <>
            <FaEdit
              style={{ cursor: 'pointer', marginRight: '10px' }}
              onClick={() => handleEdit(record)}
            />

            <FaTrash
              style={{ cursor: 'pointer' }}
              onClick={() => handleRemove(record.id)}
            />
          </>
        ),
      },
    ],
    [handleEdit, handleRemove],
  )

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
        rowKey="id"
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
