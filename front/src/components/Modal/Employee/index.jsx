import React, { useState } from 'react'
import { Modal, Form, Input, Button, Select, InputNumber, message } from 'antd'

const { Option } = Select

export default function AddEmployeeModal() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Employee Added:', values)

        // Example: you would send the data to an API or state management here
        message.success('Funcionário adicionado com sucesso!')

        // Optionally, redirect after adding an employee
        // navigate(`/employee/${values.name}`)

        setIsModalVisible(false)
        form.resetFields()
      })
      .catch((errorInfo) => {
        console.log('Failed:', errorInfo)
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Adicionar Funcionário
      </Button>
      <Modal
        title="Adicionar Funcionário"
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
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
