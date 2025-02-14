import React, { useRef } from "react"; // Importe useRef
import { Card, Tabs, Button, Input, Form, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import "./styles.css";
import loginImage from "../../components/assets/login.jpg";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib";

const { Title } = Typography;

export default function LoginAndRegister() {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  // Crie uma referência para o componente Tabs
  const tabsRef = useRef(null);

  const handleLogin = (values) => {
    setLoading(true);
    api
      .post('/login', values)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        message.success('Login realizado com sucesso!');
        navigate('/');
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || 'Erro desconhecido';
        if (err.response?.status === 401) {
          message.error('Credenciais inválidas. Por favor, tente novamente.');
        } else {
          message.error(`Erro ao fazer login: ${errorMessage}`);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleRegister = (values) => {
    setLoading(true);
    api
      .post('/register', values)
      .then(() => {
        message.success('Cadastro realizado com sucesso!');
        registerForm.resetFields(); 

        if (tabsRef.current) {
          tabsRef.current.setActiveKey("1"); 
        }
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || 'Erro ao cadastrar.';
        if (err.response?.data?.errors) {
          err.response.data.errors.forEach((error) => {
            if (error.path.includes('password')) {
              registerForm.setFields([
                {
                  name: 'password',
                  errors: [error.message],
                },
              ]);
            }
          });
        } else {
          message.error(errorMessage);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(to right, #ece9e6, #ffffff)",
      }}
    >
      <div
        className="left-section"
        style={{
          flex: 1,
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "12px 0 0 12px",
        }}
      ></div>

      <div
        className="right-section"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Card
          className="login-card"
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
          bordered={false}
        >
          <Tabs defaultActiveKey="1" centered ref={tabsRef}>
            <Tabs.TabPane key="1" tab="Login">
              <Title
                level={3}
                style={{ textAlign: "center", marginBottom: "20px" }}
              >
                Login
              </Title>

              <Form form={loginForm} onFinish={handleLogin} layout="vertical">
                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, insira seu e-mail!",
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="E-mail" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[
                    { required: true, message: "Por favor, insira sua senha!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Senha"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Entrar
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>

            <Tabs.TabPane key="2" tab="Cadastro">
              <Title
                level={3}
                style={{ textAlign: "center", marginBottom: "20px" }}
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
                      message: "Por favor, insira seu nome completo!",
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
                      message: "Por favor, insira seu e-mail!",
                    },
                    {
                      type: "email",
                      message: "Por favor, insira um e-mail válido!",
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="E-mail" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[
                    { 
                      required: true, 
                      message: "Por favor, insira uma senha!" 
                    },
                    { 
                      min: 6, 
                      message: "A senha deve ter pelo menos 6 caracteres!" 
                    }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Senha"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirmar Senha"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Por favor, confirme sua senha!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('As senhas não coincidem!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Confirmar Senha" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block>
                    Cadastrar
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}