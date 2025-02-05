import React, { useState } from 'react'
import { Card, Row, Col, Form, Input, Button, Typography } from 'antd'

const { Title, Text } = Typography

export default function UserProfile() {
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)

  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main Street, City, Country',
  })

  const handleEdit = () => {
    setIsEditing(true)
    form.setFieldsValue(userData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    form.resetFields()
  }

  const handleSave = (values) => {
    setUserData(values)
    setIsEditing(false)
  }

  return (
    <Card
      style={{
        margin: '20px',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
      }}
      bordered={false}
    >
      <Title
        level={2}
        style={{
          color: '#4B4F58',
          textAlign: 'center',
          marginBottom: '30px',
          fontWeight: 600,
        }}
      >
        Perfil do Usuário
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12}>
          <Card
            title={<Title level={4}>Informações do Usuário</Title>}
            bordered={false}
            style={{
              borderRadius: '12px',
              backgroundColor: '#fafafa',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {isEditing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={userData}
              >
                <Form.Item
                  label="Nome"
                  name="name"
                  rules={[
                    { required: true, message: 'Por favor, insira seu nome!' },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Por favor, insira seu email!' },
                    { type: 'email', message: 'Insira um email válido!' },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Telefone"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira seu telefone!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Endereço"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira seu endereço!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Row gutter={[16, 16]}>
                  <Col>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                        backgroundColor: '#1890ff',
                      }}
                    >
                      Salvar
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      onClick={handleCancel}
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                        backgroundColor: '#f5222d',
                        color: 'white',
                      }}
                    >
                      Cancelar
                    </Button>
                  </Col>
                </Row>
              </Form>
            ) : (
              <div>
                <Text>
                  <strong>Nome:</strong> {userData.name}
                </Text>
                <br />
                <Text>
                  <strong>Email:</strong> {userData.email}
                </Text>
                <br />
                <Text>
                  <strong>Telefone:</strong> {userData.phone}
                </Text>
                <br />
                <Text>
                  <strong>Endereço:</strong> {userData.address}
                </Text>
                <br />
                <Button
                  type="primary"
                  onClick={handleEdit}
                  style={{
                    marginTop: '16px',
                    borderRadius: '8px',
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    width: '100%',
                  }}
                >
                  Editar Perfil
                </Button>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card
            title={<Title level={4}>Alterar Senha</Title>}
            bordered={false}
            style={{
              borderRadius: '12px',
              backgroundColor: '#fafafa',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Form layout="vertical">
              <Form.Item
                label="Senha Atual"
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira sua senha atual!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Nova Senha"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira a nova senha!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirmar Nova Senha"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                    message: 'Por favor, confirme a nova senha!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(
                        new Error('As senhas não correspondem!'),
                      )
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#52c41a',
                  width: '100%',
                }}
              >
                Alterar Senha
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
