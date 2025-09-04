import React, { useState, useEffect } from 'react'
import {
    Card,
    Row,
    Col,
    Typography,
    Statistic,
    Spin,
    Alert,
    Button,
    Space, Tag,
    Progress
} from 'antd'
import {
    TeamOutlined,
    BankOutlined,
    CarOutlined,
    DollarOutlined,
    FileTextOutlined,
    PlusOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import dayjs from 'dayjs'

const { Title, Text } = Typography

export default function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      setError('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>Carregando dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        message="Erro ao carregar dashboard"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={loadDashboardData}>
            Tentar Novamente
          </Button>
        }
      />
    )
  }

  if (!dashboardData) {
    return (
      <Alert
        message="Nenhum dado disponível"
        description="Não foi possível carregar os dados do dashboard."
        type="warning"
        showIcon
      />
    )
  }

  const { summary, charts } = dashboardData

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Função para formatar números
  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  // Calcular percentual de funcionários ativos
  const employeeActivePercentage = summary.totalEmployees > 0 
    ? Math.round((summary.activeEmployees / summary.totalEmployees) * 100)
    : 0

  // Calcular percentual de empresas ativas
  const companyActivePercentage = summary.totalCompanies > 0
    ? Math.round((summary.activeCompanies / summary.totalCompanies) * 100)
    : 0

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          🚀 Dashboard do Sistema
        </Title>
        <Text type="secondary">
          Visão geral completa do sistema de gestão
        </Text>
      </div>

      {/* Cards de Estatísticas Principais */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total de Funcionários"
              value={summary.totalEmployees}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <Tag color="green" style={{ marginLeft: 8 }}>
                  {summary.activeEmployees} ativos
                </Tag>
              }
            />
            <Progress 
              percent={employeeActivePercentage} 
              size="small" 
              strokeColor="#52c41a"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total de Empresas"
              value={summary.totalCompanies}
              prefix={<BankOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  {summary.activeCompanies} ativas
                </Tag>
              }
            />
            <Progress 
              percent={companyActivePercentage} 
              size="small" 
              strokeColor="#1890ff"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total de Cargas"
              value={summary.totalLoads}
              prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Cargas registradas no sistema
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total de Caminhões"
              value={summary.totalTrucks}
              prefix={<CarOutlined style={{ color: '#722ed1' }} />}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Frota disponível
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Cards Financeiros */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card 
            title={
              <Space>
                <DollarOutlined style={{ color: '#52c41a' }} />
                <span>Folha Salarial Mensal</span>
              </Space>
            }
            hoverable
            style={{ borderLeft: '4px solid #52c41a' }}
          >
            <Statistic
              title="Total Salários"
              value={formatCurrency(summary.totalSalaries)}
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
            <Text type="secondary">
              {summary.activeEmployees} funcionários ativos
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card 
            title={
              <Space>
                <DollarOutlined style={{ color: '#faad14' }} />
                <span>Status Financeiro</span>
              </Space>
            }
            hoverable
            style={{ borderLeft: '4px solid #faad14' }}
          >
            <Statistic
              title="Saldo Atual"
              value={formatCurrency(0)}
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
            />
            <Text type="secondary">
              Dados em desenvolvimento
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card 
            title={
              <Space>
                <DollarOutlined style={{ color: '#1890ff' }} />
                <span>Resumo Geral</span>
              </Space>
            }
            hoverable
            style={{ borderLeft: '4px solid #1890ff' }}
          >
            <Statistic
              title="Total Geral"
              value={formatCurrency(summary.totalSalaries)}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
            <Text type="secondary">
              Custo total do sistema
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Ações Rápidas */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card title="Ações Rápidas" hoverable>
            <Space wrap size="large">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/employee')}
                size="large"
              >
                Adicionar Funcionário
              </Button>
              <Button 
                type="default" 
                icon={<BankOutlined />}
                onClick={() => navigate('/companies')}
                size="large"
              >
                Gerenciar Empresas
              </Button>
              <Button 
                type="default" 
                icon={<FileTextOutlined />}
                onClick={() => navigate('/load')}
                size="large"
              >
                Nova Carga
              </Button>
              <Button 
                type="default" 
                icon={<CarOutlined />}
                onClick={() => navigate('/vehicle-maintenance')}
                size="large"
              >
                Manutenções
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Resumo Detalhado */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Resumo do Sistema" hoverable>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Title level={4} style={{ color: '#1890ff' }}>
                Sistema Funcionando!
              </Title>
              <Text type="secondary">
                Dashboard simplificado para teste
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Estatísticas do Sistema" hoverable>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Title level={4} style={{ color: '#52c41a' }}>
                {summary.totalEmployees} Funcionários
              </Title>
              <Text type="secondary">
                {summary.activeEmployees} ativos
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Rodapé */}
      <div style={{ textAlign: 'center', marginTop: '32px', padding: '16px' }}>
        <Text type="secondary">
          Última atualização: {dayjs().format('DD/MM/YYYY HH:mm')}
        </Text>
        <br />
        <Button 
          type="link" 
          onClick={loadDashboardData}
        >
          Atualizar Dados
        </Button>
      </div>
    </div>
  )
}
