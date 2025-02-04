import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, InputNumber } from 'antd'

export default function TripModal({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) {
  const [form] = Form.useForm()

  // Preenche os campos do modal com os dados da viagem ao editar
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [initialValues, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onSubmit(values) // Envia os dados preenchidos ao editar
      })
      .catch((info) => {
        console.error('Erro ao validar formulário:', info)
      })
  }

  return (
    <Modal
      title={initialValues ? 'Editar Viagem' : 'Cadastrar Nova Viagem'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Destino"
          name="destination"
          rules={[{ required: true, message: 'Por favor, insira o destino!' }]}
        >
          <Input placeholder="Destino da viagem" />
        </Form.Item>

        <Form.Item
          label="Motorista"
          name="driver"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o nome do motorista!',
            },
          ]}
        >
          <Input placeholder="Nome do motorista" />
        </Form.Item>

        <Form.Item
          label="Data da Viagem"
          name="date"
          rules={[
            { required: true, message: 'Por favor, insira a data da viagem!' },
          ]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Caminhão"
          name="truck"
          rules={[{ required: true, message: 'Por favor, insira o caminhão!' }]}
        >
          <Input placeholder="Caminhão utilizado" />
        </Form.Item>

        <Form.Item
          label="Valor"
          name="freightValue"
          rules={[
            { required: true, message: 'Por favor, insira o valor do frete!' },
          ]}
        >
          <InputNumber
            placeholder="Valor (R$)"
            min={0}
            style={{ width: '100%' }}
            formatter={(value) =>
              `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }
            parser={(value) => value.replace(/[R$\s.]/g, '')}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
