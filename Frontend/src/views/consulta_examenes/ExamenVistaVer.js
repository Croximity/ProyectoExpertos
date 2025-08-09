import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import UserHeader from 'components/Headers/UserHeader.js';
import { examenVistaService } from '../../services/consulta_examenes/examenVistaService';

const ExamenVistaVer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examen, setExamen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarExamen();
  }, [id]);

  const cargarExamen = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examenVistaService.obtenerExamenVistaPorId(id);
      setExamen(data);
    } catch (error) {
      console.error('Error al cargar examen de vista:', error);
      setError('Error al cargar los datos del examen de vista');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/admin/consulta-examenes/examenes-vista');
  };

  const handleEditar = () => {
    navigate(`/admin/consulta-examenes/examenes-vista/editar/${id}`);
  };

  if (loading) {
    return (
      <>
        <UserHeader />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody className="text-center">
                  <Spinner color="primary" />
                  <p className="mt-2">Cargando examen de vista...</p>
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
        <UserHeader />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody>
                  <Alert color="danger">
                    <strong>Error:</strong> {error}
                  </Alert>
                  <Button color="secondary" onClick={handleVolver}>
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                    Volver
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (!examen) {
    return (
      <>
        <UserHeader />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody>
                  <Alert color="warning">
                    <strong>Advertencia:</strong> No se encontró el examen de vista
                  </Alert>
                  <Button color="secondary" onClick={handleVolver}>
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                    Volver
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <FontAwesomeIcon icon={faEye} className="mr-2" />
                  Detalles de Examen de Vista
                </h3>
                <div>
                  <Button 
                    color="secondary" 
                    size="sm" 
                    onClick={handleVolver}
                    className="mr-2"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                    Volver
                  </Button>
                  <Button 
                    color="warning" 
                    size="sm" 
                    onClick={handleEditar}
                  >
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <h5>Información General</h5>
                    <hr />
                    <Row>
                      <Col sm="4">
                        <strong>ID Examen:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="primary" pill>
                          {examen.idExamenVista || examen.id}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>ID Consulta:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="info" pill>
                          {examen.idConsulta || 'N/A'}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Fecha:</strong>
                      </Col>
                      <Col sm="8">
                        {examen.Fecha || examen.fecha || 'N/A'}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Estado:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color={examen.Estado === 'Completado' ? 'success' : 'warning'} pill>
                          {examen.Estado || examen.estado || 'N/A'}
                        </Badge>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="6">
                    <h5>Resultados</h5>
                    <hr />
                    <Row>
                      <Col sm="4">
                        <strong>Ojo Derecho:</strong>
                      </Col>
                      <Col sm="8">
                        {examen.OjoDerecho || examen.ojoDerecho || 'N/A'}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Ojo Izquierdo:</strong>
                      </Col>
                      <Col sm="8">
                        {examen.OjoIzquierdo || examen.ojoIzquierdo || 'N/A'}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Observaciones:</strong>
                      </Col>
                      <Col sm="8">
                        {examen.Observaciones || examen.observaciones || 'No hay observaciones'}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ExamenVistaVer; 