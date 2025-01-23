import React from 'react'
import { Modal, Form, Input, DatePicker, InputNumber } from 'antd'

export default function TripModal({ visible, onCancel, onSubmit }) {
  const [form] = Form.useForm()

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onSubmit(values)
      })
      .catch((info) => {
        console.error('Erro ao validar formulário:', info)
      })
  }

  return (
    <Modal
      title="Cadastrar Nova Viagem"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Descrição"
          name="descricao"
          rules={[
            {
              required: true,
              message: 'Por favor, insira a descrição da viagem!',
            },
          ]}
        >
          <Input placeholder="Descrição da viagem" />
        </Form.Item>

        <Form.Item
          label="Motorista"
          name="motorista"
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
          name="dataViagem"
          rules={[
            { required: true, message: 'Por favor, insira a data da viagem!' },
          ]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Veículo"
          name="veiculo"
          rules={[{ required: true, message: 'Por favor, insira o veículo!' }]}
        >
          <Input placeholder="Veículo utilizado" />
        </Form.Item>

        <Form.Item
          label="Valor"
          name="valor"
          rules={[
            { required: true, message: 'Por favor, insira o valor da viagem!' },
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
