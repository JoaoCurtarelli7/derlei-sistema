import React, { useEffect, useState } from 'react'
import { Card, Table, Row, Col, Typography, Spin, Button, message } from 'antd'
import { useParams } from 'react-router-dom'
import api from '../../../lib/api'
import AddTransactionModal from '../../../components/Modal/TransactionModal'

const { Title } = Typography

export default function EmployeeDetails() {
  const { id } = useParams() // Obtém o ID do funcionário da URL
  const [loading, setLoading] = useState(true) // Estado para controlar o carregamento
  const [credits, setCredits] = useState([]) // Estado para armazenar os créditos
  const [debits, setDebits] = useState([]) // Estado para armazenar os débitos
  const [total, setTotal] = useState(0) // Estado para armazenar o total a receber
  const [isModalVisible, setIsModalVisible] = useState(false) // Estado para controlar a visibilidade do modal

  // Função para buscar as transações do funcionário
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/employees/${id}/transactions`)
        const transactions = response.data

        const creditList = transactions.filter((t) => t.type === 'Crédito')
        const debitList = transactions.filter((t) => t.type === 'Débito')

        const totalCredits = creditList.reduce((sum, t) => sum + t.amount, 0)
        const totalDebits = debitList.reduce((sum, t) => sum + t.amount, 0)
        const totalToReceive = totalCredits - totalDebits

        setCredits(creditList)
        setDebits(debitList)
        setTotal(totalToReceive)
      } catch (error) {
        console.error('Erro ao buscar transações:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [id])
  // Função para adicionar uma nova transação
  const handleAddTransaction = async (values) => {
    try {
      const response = await api.post(`/employees/${id}/transactions`, values)
      const newTransaction = response.data

      // Atualiza a lista de transações
      if (newTransaction.type === 'Crédito') {
        setCredits([...credits, newTransaction])
      } else {
        setDebits([...debits, newTransaction])
      }

      // Atualiza o total a receber
      const newTotal =
        newTransaction.type === 'Crédito'
          ? total + newTransaction.amount
          : total - newTransaction.amount
      setTotal(newTotal)

      message.success('Transação adicionada com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar transação:', error)
      message.error('Erro ao adicionar transação. Tente novamente.')
    }
  }

  // Colunas da tabela de créditos e débitos
  const transactionColumns = [
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
  ]

  console.log(credits)

  return (
    <div style={{ padding: '20px' }}>
      <Card
        style={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        bordered
      >
        <Spin spinning={loading}>
          <Title
            level={3}
            style={{ textAlign: 'center', marginBottom: '30px' }}
          >
            Detalhes do Funcionário #{id}
          </Title>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card
                title="Créditos"
                bordered
                extra={
                  <Button
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                  >
                    Adicionar Crédito
                  </Button>
                }
              >
                <Table
                  dataSource={credits}
                  columns={transactionColumns}
                  pagination={false}
                  size="small"
                  style={{ marginBottom: '15px' }}
                  rowKey="id"
                />
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card
                title="Débitos"
                bordered
                extra={
                  <Button
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                  >
                    Adicionar Débito
                  </Button>
                }
              >
                <Table
                  dataSource={debits}
                  columns={transactionColumns}
                  pagination={false}
                  size="small"
                  style={{ marginBottom: '15px' }}
                  rowKey="id"
                />
              </Card>
            </Col>
          </Row>

          <Row style={{ marginTop: '20px' }}>
            <Col xs={24} sm={12}>
              <Card
                bordered
                style={{
                  padding: '15px',
                  textAlign: 'center',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Title level={4}>Total a Receber</Title>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: total >= 0 ? '#4CAF50' : '#F44336',
                  }}
                >
                  R$ {total.toFixed(2)}
                </p>
              </Card>
            </Col>
          </Row>
        </Spin>
      </Card>

      {/* Modal para adicionar transações */}
      <AddTransactionModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  )
}
