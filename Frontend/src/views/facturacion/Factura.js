import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Alert,
  Spinner
} from 'reactstrap';
import Header from 'components/Headers/Header.js';

const Factura = () => {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarFactura = async () => {
      try {
        setLoading(true);
        // Aquí deberías hacer la llamada a tu API para cargar la factura
        // Por ahora, solo simulamos la carga
        setTimeout(() => {
          setFactura({
            id: id,
            numero: 'F-001',
            fecha: new Date().toLocaleDateString(),
            cliente: 'Cliente Ejemplo',
            total: 0
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Error al cargar la factura');
        setLoading(false);
      }
    };

    cargarFactura();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow border-0">
                <CardBody className="text-center">
                  <Spinner color="primary" />
                  <p className="mt-2">Cargando factura...</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Alert color="danger">
                {error}
              </Alert>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow border-0">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Factura #{factura?.numero}</h3>
              </CardHeader>
              <CardBody>
                {factura ? (
                  <div>
                    <Row>
                      <Col md="6">
                        <p><strong>Número:</strong> {factura.numero}</p>
                        <p><strong>Fecha:</strong> {factura.fecha}</p>
                      </Col>
                      <Col md="6">
                        <p><strong>Cliente:</strong> {factura.cliente}</p>
                        <p><strong>Total:</strong> L. {factura.total.toFixed(2)}</p>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <p>No se encontró la factura</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Factura;
