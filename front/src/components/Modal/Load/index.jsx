import React from 'react'
import { Modal, Form, Input } from 'antd'

const formatCurrency = (value) => {
  const cleanValue = value.replace(/[^\d]/g, '').padStart(3, '0')
  return `R$ ${cleanValue.slice(0, -2) || '0'},${cleanValue.slice(-2)}`
}

export default function CustomModalLoad({ isVisible, onClose, onSubmit }) {
  const [form] = Form.useForm()

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          pesoCarga: parseFloat(values.pesoCarga),
          valorTotal: parseFloat(
            values.valorTotal.replace(/[^\d,]/g, '').replace(',', '.'),
          ),
          frete4: parseFloat(
            values.frete4.replace(/[^\d,]/g, '').replace(',', '.'),
          ),
          somaTotalFrete: parseFloat(
            values.somaTotalFrete.replace(/[^\d,]/g, '').replace(',', '.'),
          ),
          fechamentos: parseFloat(
            values.fechamentos.replace(/[^\d,]/g, '').replace(',', '.'),
          ),
        }
        onSubmit(formattedValues)
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
      title="Adicionar Novo Carregamento"
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="data"
          label="Data"
          rules={[{ required: true, message: 'Por favor, insira a data' }]}
        >
          <Input placeholder="DD/MM/AAAA" />
        </Form.Item>
        <Form.Item
          name="numeroCarregamento"
          label="Número do Carregamento"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o número do carregamento',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="entregas"
          label="Quantidade de Entregas"
          rules={[
            {
              required: true,
              message: 'Por favor, insira a quantidade de entregas',
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="pesoCarga"
          label="Peso da Carga (kg)"
          rules={[
            { required: true, message: 'Por favor, insira o peso da carga' },
          ]}
        >
          <Input type="number" step="0.01" />
        </Form.Item>
        <Form.Item
          name="valorTotal"
          label="Valor Total"
          rules={[
            { required: true, message: 'Por favor, insira o valor total' },
          ]}
        >
          <Input
            placeholder="R$ 0,00"
            onChange={(e) => {
              e.target.value = formatCurrency(e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item
          name="frete4"
          label="Valor do Frete 4%"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o valor do frete 4%',
            },
          ]}
        >
          <Input
            placeholder="R$ 0,00"
            onChange={(e) => {
              e.target.value = formatCurrency(e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item
          name="somaTotalFrete"
          label="Soma Total Frete"
          rules={[
            {
              required: true,
              message: 'Por favor, insira a soma total do frete',
            },
          ]}
        >
          <Input
            placeholder="R$ 0,00"
            onChange={(e) => {
              e.target.value = formatCurrency(e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item
          name="fechamentos"
          label="Fechamentos (De Quinzena)"
          rules={[
            { required: true, message: 'Por favor, insira o fechamento' },
          ]}
        >
          <Input
            placeholder="R$ 0,00"
            onChange={(e) => {
              e.target.value = formatCurrency(e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item name="observacoes" label="Observações">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
