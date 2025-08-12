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
  faTools
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { reparacionLentesService } from '../../services/consulta_examenes/reparacionLentesService';

const ReparacionLentesVer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reparacion, setReparacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarReparacionLente();
  }, [id]);

  const cargarReparacionLente = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reparacionLentesService.obtenerReparacionLentePorId(id);
      setReparacion(data);
    } catch (error) {
      console.error('Error al cargar reparación de lentes:', error);
      setError('Error al cargar los datos de la reparación de lentes');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/admin/consulta-examenes/reparacion-lentes');
  };

  const handleEditar = () => {
    navigate(`/admin/consulta-examenes/reparacion-lentes/editar/${id}`);
  };

  if (loading) {
    return (
      <>
        <HeaderBlanco />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody className="text-center">
                  <Spinner color="primary" />
                  <p className="mt-2">Cargando reparación de lentes...</p>
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
        <HeaderBlanco />
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

  if (!reparacion) {
    return (
      <>
        <HeaderBlanco />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody>
                  <Alert color="warning">
                    <strong>Advertencia:</strong> No se encontró la reparación de lentes
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
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <FontAwesomeIcon icon={faTools} className="mr-2" />
                  Detalles de Reparación de Lentes
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
                        <strong>ID Reparación:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="primary" pill>
                          {reparacion.idReparacionDeLentes || reparacion.id}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>ID Consulta:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="info" pill>
                          {reparacion.idConsulta || 'N/A'}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Tipo de Reparación:</strong>
                      </Col>
                      <Col sm="8">
                        {reparacion.Tipo_Reparacion || reparacion.tipoReparacion || reparacion.tipo_reparacion || 'N/A'}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Costo:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="success" pill>
                          L. {reparacion.Costo || reparacion.costo || 'N/A'}
                        </Badge>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="6">
                    <h5>Descripción</h5>
                    <hr />
                    <p>
                      {reparacion.Descripcion || reparacion.descripcion || 'No hay descripción disponible'}
                    </p>
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

export default ReparacionLentesVer; 