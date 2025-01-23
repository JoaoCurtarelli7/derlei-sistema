import React from 'react'
import { Card, Tabs, Button, Input, Form, Typography } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import './styles.css'
import loginImage from '../../components/assets/login.jpg'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

export default function LoginAndRegister() {
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/')
  }

  const handleRegister = (values) => {
    console.log('Cadastro:', values)
  }

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={loginImage} alt="Login" className="login-image" />
      </div>
      <div className="right-section">
        <Card className="login-card" bordered={false}>
          <Tabs defaultActiveKey="1">
            {/* Aba de Login */}
            <Tabs.TabPane tab="Login" key="1">
              <Title level={3} style={{ textAlign: 'center' }}>
                Login
              </Title>
              <Form form={loginForm} onFinish={handleLogin} layout="vertical">
                <Form.Item
                  name="username"
                  label="Usuário"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira seu usuário!',
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Usuário" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[
                    { required: true, message: 'Por favor, insira sua senha!' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Senha"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Entrar
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>

            {/* Aba de Cadastro */}
            <Tabs.TabPane tab="Cadastro" key="2">
              <Title level={3} style={{ textAlign: 'center' }}>
                Cadastro
              </Title>
              <Form
                form={registerForm}
                onFinish={handleRegister}
                layout="vertical"
              >
                <Form.Item
                  name="name"
                  label="Nome Completo"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira seu nome completo!',
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nome Completo"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira seu e-mail!',
                    },
                    {
                      type: 'email',
                      message: 'Por favor, insira um e-mail válido!',
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="E-mail" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[
                    { required: true, message: 'Por favor, insira uma senha!' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Senha"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Cadastrar
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
