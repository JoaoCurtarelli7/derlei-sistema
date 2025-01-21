import React from 'react'
import { Modal, Form, Input } from 'antd'

export default function CustomModal({
  isVisible,
  onClose,
  onSubmit,
  title,
  type,
}) {
  const [form] = Form.useForm()

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values)
        form.resetFields()
        onClose()
      })
      .catch((info) => console.error('Validation failed:', info))
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      visible={isVisible}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        {type === 'entrada' && (
          <>
            <Form.Item
              name="descricao"
              label="Descrição"
              rules={[
                { required: true, message: 'Por favor, insira a descrição.' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="valor"
              label="Valor"
              rules={[
                { required: true, message: 'Por favor, insira o valor.' },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        {type === 'saida' && (
          <>
            <Form.Item
              name="descricao"
              label="Descrição"
              rules={[
                { required: true, message: 'Por favor, insira a descrição.' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="valor"
              label="Despesa"
              rules={[
                { required: true, message: 'Por favor, insira a despesa.' },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        {type === 'imposto' && (
          <>
            <Form.Item
              name="nome"
              label="Nome do Imposto"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o nome do imposto.',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="valor"
              label="Valor"
              rules={[
                { required: true, message: 'Por favor, insira o valor.' },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}
