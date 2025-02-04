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
    <div
      className="login-container"
      style={{
        display: 'flex',
        height: '100vh',
        background: 'linear-gradient(to right, #ece9e6, #ffffff)',
      }}
    >
      {/* Left Section */}
      <div
        className="left-section"
        style={{
          flex: 1,
          backgroundImage: `url(${loginImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px 0 0 12px',
        }}
      ></div>

      {/* Right Section */}
      <div
        className="right-section"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <Card
          className="login-card"
          style={{
            width: '100%',
            maxWidth: '400px',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff',
          }}
          bordered={false}
        >
          <Tabs
            defaultActiveKey="1"
            centered
            items={[
              {
                key: '1',
                label: <span style={{ fontWeight: 'bold' }}>Login</span>,
                children: (
                  <>
                    <Title
                      level={3}
                      style={{ textAlign: 'center', marginBottom: '20px' }}
                    >
                      Login
                    </Title>
                    <Form
                      form={loginForm}
                      onFinish={handleLogin}
                      layout="vertical"
                    >
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
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="Usuário"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        label="Senha"
                        rules={[
                          {
                            required: true,
                            message: 'Por favor, insira sua senha!',
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined />}
                          placeholder="Senha"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          style={{
                            backgroundColor: '#1890ff',
                            borderRadius: '8px',
                          }}
                        >
                          Entrar
                        </Button>
                      </Form.Item>
                    </Form>
                  </>
                ),
              },
              {
                key: '2',
                label: <span style={{ fontWeight: 'bold' }}>Cadastro</span>,
                children: (
                  <>
                    <Title
                      level={3}
                      style={{ textAlign: 'center', marginBottom: '20px' }}
                    >
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
                          style={{ borderRadius: '8px' }}
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
                        <Input
                          prefix={<MailOutlined />}
                          placeholder="E-mail"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        label="Senha"
                        rules={[
                          {
                            required: true,
                            message: 'Por favor, insira uma senha!',
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined />}
                          placeholder="Senha"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          style={{
                            backgroundColor: '#52c41a',
                            borderRadius: '8px',
                          }}
                        >
                          Cadastrar
                        </Button>
                      </Form.Item>
                    </Form>
                  </>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  )
}
