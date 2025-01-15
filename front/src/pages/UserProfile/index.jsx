import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

export default function UserProfile() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  // Dados simulados do usuário
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main Street, City, Country',
  });

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(userData); // Preenche os campos do formulário com os dados do usuário
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields(); // Limpa os campos do formulário
  };

  const handleSave = (values) => {
    setUserData(values); // Atualiza os dados do usuário
    setIsEditing(false);
  };

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <Title level={2}>Perfil do Usuário</Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Informações do Usuário" bordered>
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
                  rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
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
                  rules={[{ required: true, message: 'Por favor, insira seu telefone!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Endereço"
                  name="address"
                  rules={[{ required: true, message: 'Por favor, insira seu endereço!' }]}
                >
                  <Input />
                </Form.Item>

                <Row gutter={[8, 8]}>
                  <Col>
                    <Button type="primary" htmlType="submit">
                      Salvar
                    </Button>
                  </Col>
                  <Col>
                    <Button onClick={handleCancel}>Cancelar</Button>
                  </Col>
                </Row>
              </Form>
            ) : (
              <div>
                <p>
                  <strong>Nome:</strong> {userData.name}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Telefone:</strong> {userData.phone}
                </p>
                <p>
                  <strong>Endereço:</strong> {userData.address}
                </p>
                <Button type="primary" onClick={handleEdit}>
                  Editar Perfil
                </Button>
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Alterar Senha" bordered>
            <Form layout="vertical">
              <Form.Item
                label="Senha Atual"
                name="currentPassword"
                rules={[{ required: true, message: 'Por favor, insira sua senha atual!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Nova Senha"
                name="newPassword"
                rules={[{ required: true, message: 'Por favor, insira a nova senha!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirmar Nova Senha"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Por favor, confirme a nova senha!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('As senhas não correspondem!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Alterar Senha
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
