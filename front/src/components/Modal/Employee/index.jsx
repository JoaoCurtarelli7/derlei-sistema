import React, { useState } from 'react'
import { Modal, Form, Input, Button, Select, InputNumber, message } from 'antd'
import api from '../../../lib/api'

const { Option } = Select

export default function AddEmployeeModal({
  addEmployee,
  editingEmployee,
  setEditingEmployee,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Abre o modal e preenche os campos se estiver editando
  const showModal = () => {
    setIsModalVisible(true)
    if (editingEmployee) {
      form.setFieldsValue({
        nome: editingEmployee.name,
        cargo: editingEmployee.role,
        salarioBase: editingEmployee.baseSalary,
        status: editingEmployee.status,
      })
    } else {
      form.resetFields()
    }
  }

  // Fecha o modal e limpa o estado de edição
  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingEmployee(null)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()

      if (editingEmployee) {
        const response = await api.put(`/employees/${editingEmployee.id}`, {
          name: values.nome,
          role: values.cargo,
          baseSalary: values.salarioBase,
          status: values.status,
        })
        addEmployee(response.data)
        message.success('Funcionário atualizado com sucesso!')
      } else {
        // Adicionar novo funcionário (POST)
        const response = await api.post('/employees', {
          name: values.nome,
          role: values.cargo,
          baseSalary: values.salarioBase,
          status: values.status,
        })
        addEmployee(response.data)
        message.success('Funcionário adicionado com sucesso!')
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error)
      message.error('Erro ao salvar funcionário. Tente novamente.')
    }
  }

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        {editingEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário'}
      </Button>
      <Modal
        title={editingEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" name="add_employee_form">
          <Form.Item
            label="Nome"
            name="nome"
            rules={[
              {
                required: true,
                message: 'Por favor, insira o nome do funcionário!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Cargo"
            name="cargo"
            rules={[
              {
                required: true,
                message: 'Por favor, insira o cargo do funcionário!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Salário Base"
            name="salarioBase"
            rules={[
              { required: true, message: 'Por favor, insira o salário base!' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(value) => `R$ ${value}`}
              parser={(value) => value.replace('R$', '')}
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              { required: true, message: 'Por favor, selecione o status!' },
            ]}
          >
            <Select placeholder="Selecione o status">
              <Option value="Ativo">Ativo</Option>
              <Option value="Inativo">Inativo</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              onClick={handleOk}
              style={{ marginTop: '10px' }}
            >
              {editingEmployee ? 'Salvar Alterações' : 'Adicionar'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
