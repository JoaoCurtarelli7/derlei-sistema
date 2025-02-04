import React, { useEffect } from 'react'
import { Modal, Form, Input, Button, InputNumber } from 'antd'

export default function AddCompanyModal({
  isModalVisible,
  setIsModalVisible,
  setData,
  data,
  editingCompany,
  setEditingCompany,
}) {
  const [form] = Form.useForm()

  // Preencher o formulário com os dados da empresa quando o modal for aberto
  useEffect(() => {
    if (editingCompany) {
      form.setFieldsValue(editingCompany) // Preenche os campos com os valores da empresa a ser editada
    } else {
      form.resetFields() // Reseta os campos caso seja um novo cadastro
    }
  }, [editingCompany, form])

  // Função para adicionar ou editar a empresa
  const handleSubmit = (values) => {
    if (editingCompany) {
      // Editar a empresa
      const updatedData = data.map((company) =>
        company.key === editingCompany.key
          ? { ...company, ...values, comissao: values.comissao ? 'Sim' : 'Não' }
          : company,
      )
      setData(updatedData)
    } else {
      // Adicionar nova empresa
      const newCompany = {
        key: (data.length + 1).toString(),
        ...values,
        dataCadastro: new Date().toLocaleDateString(),
        comissao: values.comissao ? 'Sim' : 'Não',
      }
      setData([...data, newCompany])
    }
    setIsModalVisible(false)
    setEditingCompany(null) // Limpar a empresa que está sendo editada após salvar
  }

  return (
    <Modal
      title={editingCompany ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
      visible={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false)
        setEditingCompany(null) // Limpar quando o modal for fechado
      }}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Nome"
          name="nome"
          rules={[
            { required: true, message: 'Por favor, insira o nome da empresa!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="tipo"
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
          name="responsavel"
          rules={[
            { required: true, message: 'Por favor, insira o responsável!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Comissão (%)"
          name="comissao"
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
          <Input />
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
