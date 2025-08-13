import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert
} from 'reactstrap';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { consultaService } from '../../services/consulta_examenes/consultaService';

const ConsultaVer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [consulta, setConsulta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const data = await consultaService.obtenerConsultaPorId(id);
        setConsulta(data);
      } catch (err) {
        setError('No se pudo cargar la consulta');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Detalle de Consulta</h3>
                <Button color="secondary" size="sm" onClick={() => navigate('/admin/consulta-examenes/consultas')}>
                  Volver
                </Button>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <div className="text-center"><Spinner color="primary" /></div>
                ) : error ? (
                  <Alert color="danger">{error}</Alert>
                ) : consulta ? (
                  <>
                    <Row>
                      <Col md="6">
                        <p><strong>ID:</strong> {consulta.idConsulta || consulta.id}</p>
                        <p><strong>Cliente:</strong> {consulta.idCliente}</p>
                        <p><strong>Empleado:</strong> {consulta.idEmpleado}</p>
                      </Col>
                      <Col md="6">
                        <p><strong>Fecha:</strong> {consulta.Fecha_consulta ? new Date(consulta.Fecha_consulta).toLocaleDateString() : '-'}</p>
                        <p><strong>Motivo:</strong> {consulta.Motivo_consulta}</p>
                        <p><strong>Observaciones:</strong> {consulta.Observaciones || '-'}</p>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ConsultaVer;


