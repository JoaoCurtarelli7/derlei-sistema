import { useEffect, useState } from 'react';
import { Card, Button, Table, Typography, Space, Popconfirm, message } from 'antd';
import TripModal from '../../../components/Modal/Trip';
import { PlusCircleOutlined } from '@ant-design/icons';
import { FaTrash, FaDollarSign, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function TripList() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

  // Carregar todas as viagens
  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data);
    } catch (error) {
      console.error(error);
      message.error('Erro ao carregar viagens');
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Adicionar viagem
  const handleAddTrip = async (values) => {
    try {
      const response = await api.post('/trips', values);
      setTrips((prev) => [...prev, response.data]);
      setIsModalVisible(false);
      message.success('Viagem adicionada com sucesso!');
    } catch (error) {
      console.error(error);
      message.error('Erro ao adicionar viagem');
    }
  };

  // Editar viagem
  const handleEditTrip = (trip) => {
    setCurrentTrip(trip);
    setIsModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      const response = await api.put(`/trips/${currentTrip.id}`, values);
      setTrips((prev) =>
        prev.map((trip) => (trip.id === currentTrip.id ? response.data : trip))
      );
      setCurrentTrip(null);
      setIsModalVisible(false);
      message.success('Viagem atualizada com sucesso!');
    } catch (error) {
      console.error(error);
      message.error('Erro ao atualizar viagem');
    }
  };

  // Deletar viagem
  const handleDeleteTrip = async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
      message.success('Viagem removida com sucesso!');
    } catch (error) {
      console.error(error);
      message.error('Erro ao remover viagem');
    }
  };

  const columns = [
    { title: 'Destino', dataIndex: 'destination', key: 'destination' },
    { title: 'Motorista', dataIndex: 'driver', key: 'driver' },
    { 
      title: 'Data', 
      dataIndex: 'date', 
      key: 'date',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
    },
    { title: 'Caminhão', dataIndex: 'truck', key: 'truck' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <>
          <FaDollarSign
            style={{ cursor: 'pointer', marginRight: 10 }}
            onClick={() =>
              navigate(`/vehicle/trip-expenses/${record.id}`, { state: record })
            }
          />
          <FaEdit
            style={{ cursor: 'pointer', marginRight: 10 }}
            onClick={() => handleEditTrip(record)}
          />
          <Popconfirm
            title="Tem certeza de que deseja excluir?"
            onConfirm={() => handleDeleteTrip(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <FaTrash style={{ cursor: 'pointer' }} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card style={{ margin: 20, padding: 20 }} bordered>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={2}>Lista de Viagens</Title>

        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setCurrentTrip(null);
            setIsModalVisible(true);
          }}
        >
          Adicionar Viagem
        </Button>

        <Table dataSource={trips} columns={columns} pagination={{ pageSize: 5 }} rowKey="id" />

        <TripModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={currentTrip ? handleEditSubmit : handleAddTrip}
          initialValues={currentTrip}
        />
      </Space>
    </Card>
  );
}
