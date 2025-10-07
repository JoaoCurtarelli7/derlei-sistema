import React, { useEffect, useMemo, useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Select, Checkbox, Space, message } from 'antd'
import api from '../../../lib/api'

const AVAILABLE_SCREENS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'closings', label: 'Fechamentos' },
  { key: 'employees', label: 'Funcionários' },
  { key: 'companies', label: 'Empresas' },
  { key: 'loads', label: 'Cargas' },
  { key: 'vehicles', label: 'Frota' },
  { key: 'reports', label: 'Relatórios' }
]

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [form] = Form.useForm()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (error) {
      message.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const columns = useMemo(() => ([
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    { title: 'E-mail', dataIndex: 'email', key: 'email' },
    { title: 'Perfil', dataIndex: 'role', key: 'role', render: (role) => (
      <Tag color={role === 'admin' ? 'gold' : 'blue'}>{role}</Tag>
    ) },
    { title: 'Permissões', dataIndex: 'permissions', key: 'permissions', render: (perms) => {
      const list = Array.isArray(perms) ? perms : []
      if (list.length === 0) return <Tag>Sem restrições</Tag>
      return (
        <Space wrap>
          {list.map((p) => {
            const def = AVAILABLE_SCREENS.find(s => s.key === p)
            return <Tag key={p}>{def?.label || p}</Tag>
          })}
        </Space>
      )
    } },
    {
      title: 'Ações', key: 'actions', render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(record)}>Editar</Button>
        </Space>
      )
    }
  ]), [])

  const onEdit = (user) => {
    setEditingUser(user)
    form.setFieldsValue({
      role: user.role,
      permissions: Array.isArray(user.permissions) ? user.permissions : []
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      await api.patch(`/admin/users/${editingUser.id}`, values)
      message.success('Usuário atualizado')
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      if (error?.errorFields) return
      message.error('Erro ao salvar usuário')
    }
  }

  return (
    <Card title="Gestão de Usuários" style={{ margin: 20 }}>
      <Table
        loading={loading}
        dataSource={users}
        columns={columns}
        rowKey="id"
      />

      <Modal
        open={!!editingUser}
        title={editingUser ? `Editar: ${editingUser.name}` : ''}
        onCancel={() => setEditingUser(null)}
        onOk={handleSave}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="role" label="Perfil" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="user">Usuário</Select.Option>
              <Select.Option value="admin">Administrador</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="permissions" label="Telas permitidas (deixe vazio para liberar todas)">
            <Checkbox.Group style={{ width: '100%' }}>
              <Space direction="vertical">
                {AVAILABLE_SCREENS.map((s) => (
                  <Checkbox key={s.key} value={s.key}>{s.label}</Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}


