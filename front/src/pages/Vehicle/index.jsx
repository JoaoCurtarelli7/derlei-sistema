import { useEffect, useState } from "react";
import { Card, Button, Row, Col, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import AddVehicleModal from "../../components/Modal/Vehicle";
import { api } from "../../lib";

const { Title } = Typography;

export default function VehicleList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);

  // Carregar caminhões
  const loadTrucks = async () => {
    try {
      const response = await api.get("/trucks");
      setData(response.data);
    } catch (error) {
      console.error("Erro ao carregar os caminhões:", error);
      message.error("Erro ao carregar os caminhões");
    }
  };

  useEffect(() => {
    loadTrucks();
  }, []);

  // Adicionar ou editar caminhão
  const handleSaveVehicle = async (values) => {
    try {
      if (currentVehicle?.id) {
        // Editar
        const response = await api.put(`/trucks/${currentVehicle.id}`, values);
        setData((prev) =>
          prev.map((v) => (v.id === currentVehicle.id ? response.data : v))
        );
        message.success("Caminhão atualizado com sucesso!");
      } else {
        // Adicionar
        const response = await api.post("/trucks", values);
        setData((prev) => [...prev, response.data]);
        message.success("Caminhão adicionado com sucesso!");
      }

      setIsModalVisible(false);
      setCurrentVehicle(null);
    } catch (error) {
      console.error("Erro ao salvar caminhão:", error);
      message.error("Erro ao salvar caminhão");
    }
  };

  return (
    <Card style={{ margin: 20, padding: 20, borderRadius: 8 }}>
      <Title level={3}>Lista de Caminhões</Title>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setCurrentVehicle(null);
          setIsModalVisible(true);
        }}
      >
        Adicionar Caminhão
      </Button>

      <Row gutter={[16, 16]}>
        {data.map((vehicle) => (
          <Col xs={24} sm={12} md={8} lg={6} key={vehicle.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={vehicle.name}
                  src={vehicle.image || "https://via.placeholder.com/150"}
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
              actions={[
                <Button
                  type="link"
                  onClick={() =>
                    navigate(`/vehicle-maintenance/${vehicle.id}`)
                  }
                >
                  Manutenção
                </Button>,
                <Button type="link" onClick={() => navigate(`/vehicle/trip`)}>
                  Viagens
                </Button>,
                <Button
                  type="link"
                  onClick={() => {
                    setCurrentVehicle(vehicle);
                    setIsModalVisible(true);
                  }}
                >
                  Editar
                </Button>,
              ]}
            >
              <Card.Meta
                title={<strong>{vehicle.name}</strong>}
                description={
                  <div>
                    <p>
                      <strong>Placa:</strong> {vehicle.plate}
                    </p>
                    <p>
                      <strong>Marca:</strong> {vehicle.brand}
                    </p>
                    <p>
                      <strong>Ano:</strong> {vehicle.year}
                    </p>
                    <p>
                      <strong>Venc. Doc.:</strong>{" "}
                      {vehicle.docExpiry
                        ? new Date(vehicle.docExpiry).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>
                      <strong>Renavam:</strong> {vehicle.renavam}
                    </p>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <AddVehicleModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentVehicle(null);
        }}
        vehicle={currentVehicle}
        onSubmit={handleSaveVehicle}
      />
    </Card>
  );
}
