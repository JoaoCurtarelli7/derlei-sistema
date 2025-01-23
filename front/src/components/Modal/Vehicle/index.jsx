import React from 'react'
import { Modal, Form, Input, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function AddVehicleModal({ visible, onCancel, onSubmit }) {
  const [form] = Form.useForm()

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values)
        form.resetFields()
      })
      .catch((info) => {
        console.error('Validate Failed:', info)
      })
  }

  return (
    <Modal
      visible={visible}
      title="Adicionar Caminhão"
      onCancel={onCancel}
      onOk={handleOk}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nome"
          label="Nome"
          rules={[
            { required: true, message: 'Por favor, insira o nome do caminhão' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="placa"
          label="Placa"
          rules={[{ required: true, message: 'Por favor, insira a placa' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="marca"
          label="Marca"
          rules={[{ required: true, message: 'Por favor, insira a marca' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ano"
          label="Ano"
          rules={[{ required: true, message: 'Por favor, insira o ano' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="vencimentoDoc"
          label="Vencimento do Documento"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o vencimento do documento',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="renavam"
          label="Renavam"
          rules={[{ required: true, message: 'Por favor, insira o renavam' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="imagem" label="Imagem do Caminhão">
          <Upload action="/upload" listType="picture-card" maxCount={1}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
