import React, { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Button, DatePicker } from 'antd'
import dayjs from 'dayjs'

export default function VehicleMaintenanceModal({
  visible,
  onCancel,
  onAddMaintenance,
  onEditMaintenance,
  editingMaintenance,
}) {
  const [form] = Form.useForm()

  // Set form fields when editing
  useEffect(() => {
    if (editingMaintenance) {
      form.setFieldsValue({
        ...editingMaintenance,
        data: editingMaintenance.data ? dayjs(editingMaintenance.data) : null
      })
    }
  }, [editingMaintenance, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          data: values.data ? values.data.format('DD/MM/YYYY') : null
        }
        if (editingMaintenance) {
          onEditMaintenance(formattedValues) // Call edit function
        } else {
          onAddMaintenance(formattedValues) // Call add function
        }
        form.resetFields()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Modal
      title={editingMaintenance ? 'Editar Manutenção' : 'Adicionar Manutenção'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={editingMaintenance ? 'Salvar' : 'Adicionar'}
      cancelText="Cancelar"
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          {editingMaintenance ? 'Salvar' : 'Adicionar'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="maintenanceForm">
        <Form.Item
          name="data"
          label="Data"
          rules={[
            {
              required: true,
              message: 'Por favor, insira a data da manutenção',
            },
          ]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="DD/MM/YYYY"
            placeholder="Selecione a data"
          />
        </Form.Item>
        <Form.Item
          name="servico"
          label="Serviço Realizado"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o serviço realizado',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="km"
          label="KM"
          rules={[{ required: true, message: 'Por favor, insira o KM' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} step={1} />
        </Form.Item>
        <Form.Item
          name="valor"
          label="Valor (R$)"
          rules={[{ required: true, message: 'Por favor, insira o valor' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={0.01}
            prefix="R$ "
            formatter={(value) => (value ? `R$ ${value}` : '')}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
