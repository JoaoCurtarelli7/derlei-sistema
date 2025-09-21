import { useCallback, useEffect, useState } from 'react';
import { Card, Table, Typography, Button, message } from 'antd';
import { useParams } from 'react-router-dom';
import VehicleMaintenanceModal from '../../../components/Modal/MainTenanceVehicle';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { api } from '../../../lib';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function VehicleMaintenanceList() {
  const { id } = useParams(); 
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);


  const fetchMaintenance = useCallback(async () => {
    try {
      const response = await api.get(`/trucks/${id}/maintenances`);
      console.log('API response ->', response.data);
  
      // pega direto a chave correta
      const arr = Array.isArray(response.data.maintenances)
        ? response.data.maintenances
        : [];
  
      setMaintenanceData(arr);
    } catch (error) {
      console.error('Erro ao carregar manutenções:', error);
      message.error('Erro ao carregar manutenções');
      setMaintenanceData([]);
    }
  }, [id]);
  
  const totalGasto = Array.isArray(maintenanceData)
  ? maintenanceData.reduce((acc, curr) => acc + (curr.valor || 0), 0)
  : 0;

  useEffect(() => {
    fetchMaintenance();
  }, [id]);

  // Adicionar manutenção
  const handleAddMaintenance = async (values) => {
    try {
      const response = await api.post(`/trucks/${id}/maintenances`, values);
      setMaintenanceData((prev) => [...prev, response.data]);
      setIsModalVisible(false);
      message.success('Manutenção adicionada com sucesso!');
    } catch (error) {
      console.error(error);
      message.error('Erro ao adicionar manutenção');
    }
  };

  // Editar manutenção
  const handleEditMaintenance = async (values) => {
    try {
      const response = await api.put(
        `/trucks/${id}/maintenances/${editingMaintenance.id}`,
        values
      );
      setMaintenanceData((prev) =>
        prev.map((item) =>
          item.id === editingMaintenance.id ? response.data : item
        )
      );
      setIsModalVisible(false);
      setEditingMaintenance(null);
      message.success('Manutenção atualizada com sucesso!');
    } catch (error) {
      console.error(error);
      message.error('Erro ao atualizar manutenção');
    }
  };

  // Deletar manutenção
  const handleDelete = async (maintenanceId) => {
    try {
      await api.delete(`/trucks/${id}/maintenances/${maintenanceId}`);
      setMaintenanceData((prev) =>
        prev.filter((item) => item.id !== maintenanceId)
      );
      message.success('Manutenção removida com sucesso!');
    } catch (error) {
      console.error(error);
      message.error('Erro ao remover manutenção');
    }
  };

  const handleEdit = (record) => {
    setEditingMaintenance(record);
    setIsModalVisible(true);
  };

  const columns = [
    { 
      title: 'Data', 
      dataIndex: 'data', 
      key: 'data',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
    },
    { title: 'Serviço Realizado', dataIndex: 'servico', key: 'servico' },
    { title: 'KM', dataIndex: 'km', key: 'km', align: 'right' },
    { title: 'Valor (R$)', dataIndex: 'valor', key: 'valor', align: 'right' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <>
          <FaEdit
            onClick={() => handleEdit(record)}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          />
          <FaTrash
            onClick={() => handleDelete(record.id)}
            style={{ cursor: 'pointer' }}
          />
        </>
      ),
    },
  ];

  return (
    <Card style={{ margin: '20px', padding: '20px' }} bordered>
      <Title level={3}>Manutenção do Caminhão #{id}</Title>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalVisible(true)}
      >
        Adicionar Manutenção
      </Button>

      <Table
  dataSource={Array.isArray(maintenanceData) ? maintenanceData : []}
  columns={columns}
  rowKey="id"
  pagination={{ pageSize: 5 }}
  footer={() => (
    <div style={{ textAlign: "right", fontWeight: "bold" }}>
      Total Gasto: R$ {maintenanceData.reduce((acc, curr) => acc + (curr.valor || 0), 0).toFixed(2)}
    </div>
  )}
/>


      <VehicleMaintenanceModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onAddMaintenance={handleAddMaintenance}
        onEditMaintenance={handleEditMaintenance}
        editingMaintenance={editingMaintenance}
      />
    </Card>
  );
}
