import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, InputNumber, Select } from 'antd'
import dayjs from 'dayjs'

export default function TripModal({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) {
  const [form] = Form.useForm()

  // Preenche os campos (inclui conversão de date e defaults)
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        destination: initialValues.destination,
        driver: initialValues.driver,
        date: initialValues.date ? dayjs(initialValues.date) : null,
        freightValue: initialValues.freightValue,
        status: initialValues.status || 'em_andamento',
        notes: initialValues.notes || ''
      })
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
      <Form form={form} layout="vertical" style={{ paddingTop: 8 }}>
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

        <Form.Item label="Status" name="status" initialValue="em_andamento">
          <Select
            options={[
              { value: 'em_andamento', label: 'Em andamento' },
              { value: 'concluida', label: 'Concluída' },
              { value: 'cancelada', label: 'Cancelada' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Observações" name="notes">
          <Input.TextArea rows={3} placeholder="Observações da viagem" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
