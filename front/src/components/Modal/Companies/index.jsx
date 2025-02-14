import React, { useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  Button,
  InputNumber,
  message,
  DatePicker,
  Select,
} from 'antd'
import moment from 'moment'
import api from '../../../lib/api'

export default function AddCompanyModal({
  isModalVisible,
  setIsModalVisible,
  setData,
  data,
  editingCompany,
  setEditingCompany,
}) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (editingCompany) {
      const formattedCompany = {
        ...editingCompany,
        dateRegistration: moment(editingCompany.dateRegistration),
      }
      form.setFieldsValue(formattedCompany)
    } else {
      form.resetFields()
    }
  }, [editingCompany, form])

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        dateRegistration: values.dateRegistration.format('YYYY-MM-DD'),
      }

      if (editingCompany) {
        const response = await api.put(
          `/company/${editingCompany.id}`,
          formattedValues,
        )
        const updatedCompany = response.data

        const updatedData = data.map((company) =>
          company.id === editingCompany.id ? updatedCompany : company,
        )
        setData(updatedData)

        message.success('Empresa atualizada com sucesso!')
      } else {
        const response = await api.post('/company', formattedValues)
        const newCompany = response.data

        setData([...data, newCompany])

        message.success('Empresa cadastrada com sucesso!')
      }

      setIsModalVisible(false)
      setEditingCompany(null)
    } catch (error) {
      console.error('Erro ao salvar empresa:', error)
      message.error(
        error.response?.data?.message ||
          'Erro ao salvar empresa. Tente novamente.',
      )
    }
  }

  return (
    <Modal
      title={editingCompany ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
      visible={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false)
        setEditingCompany(null) // Limpa a empresa que está sendo editada ao fechar o modal
      }}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Nome"
          name="name"
          rules={[
            { required: true, message: 'Por favor, insira o nome da empresa!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="type"
          rules={[
            { required: true, message: 'Por favor, insira o tipo da empresa!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="CNPJ"
          name="cnpj"
          rules={[{ required: true, message: 'Por favor, insira o CNPJ!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Responsável"
          name="responsible"
          rules={[
            { required: true, message: 'Por favor, insira o responsável!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Comissão (%)"
          name="commission"
          rules={[
            {
              required: true,
              message: 'Por favor, insira a porcentagem de comissão!',
            },
          ]}
        >
          <InputNumber min={0} max={100} />
        </Form.Item>

        <Form.Item
          label="Data de Cadastro"
          name="dateRegistration"
          rules={[
            {
              required: true,
              message: 'Por favor, insira a data de cadastro!',
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          initialValue="Ativo"
          rules={[
            {
              required: true,
              message: 'Por favor, selecione o status da empresa!',
            },
          ]}
        >
          <Select
            options={[
              {
                label: 'Ativo',
                value: 'Ativo',
              },
              {
                label: 'Inativo',
                value: 'Inativo',
              },
            ]}
          ></Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editingCompany ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
