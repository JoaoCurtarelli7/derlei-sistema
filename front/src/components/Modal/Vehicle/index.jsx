import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import dayjs from "dayjs";

export default function AddVehicleModal({ visible, onCancel, onSubmit, vehicle }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (vehicle) {
      form.setFieldsValue({
        ...vehicle,
        docExpiry: vehicle.docExpiry ? dayjs(vehicle.docExpiry) : null,
      });
    } else {
      form.resetFields();
    }
  }, [vehicle, form]);

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        if (values.docExpiry) values.docExpiry = values.docExpiry.toISOString();
        onSubmit(values);
        form.resetFields();
      })
      .catch((err) => {
        console.log("Validação falhou:", err);
      });
  };

  return (
    <Modal
      title={vehicle ? "Editar Caminhão" : "Adicionar Caminhão"}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={vehicle ? "Salvar" : "Adicionar"}
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="plate" label="Placa" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="brand" label="Marca" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="year" label="Ano" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} min={1900} max={2100} />
        </Form.Item>
        <Form.Item name="docExpiry" label="Vencimento do Documento" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="renavam" label="Renavam" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="image" label="URL da Imagem">
          <Input placeholder="URL da imagem do caminhão" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
