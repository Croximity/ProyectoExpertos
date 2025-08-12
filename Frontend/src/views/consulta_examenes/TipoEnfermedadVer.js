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
  faVirus
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { tipoEnfermedadService } from '../../services/consulta_examenes/tipoEnfermedadService';

const TipoEnfermedadVer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipoEnfermedad, setTipoEnfermedad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarTipoEnfermedad();
  }, [id]);

  const cargarTipoEnfermedad = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tipoEnfermedadService.obtenerTipoEnfermedadPorId(id);
      setTipoEnfermedad(data);
    } catch (error) {
      console.error('Error al cargar tipo de enfermedad:', error);
      setError('Error al cargar los datos del tipo de enfermedad');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/admin/consulta-examenes/tipos-enfermedad');
  };

  const handleEditar = () => {
    navigate(`/admin/consulta-examenes/tipos-enfermedad/editar/${id}`);
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
                  <p className="mt-2">Cargando tipo de enfermedad...</p>
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

  if (!tipoEnfermedad) {
    return (
      <>
        <HeaderBlanco />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody>
                  <Alert color="warning">
                    <strong>Advertencia:</strong> No se encontró el tipo de enfermedad
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
                  <FontAwesomeIcon icon={faVirus} className="mr-2" />
                  Detalles de Tipo de Enfermedad
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
                        <strong>ID Tipo:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="primary" pill>
                          {tipoEnfermedad.idTipoEnfermedad || tipoEnfermedad.id}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Nombre:</strong>
                      </Col>
                      <Col sm="8">
                        <strong>{tipoEnfermedad.Nombre || tipoEnfermedad.nombre || 'N/A'}</strong>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="6">
                    <h5>Descripción</h5>
                    <hr />
                    <p>
                      {tipoEnfermedad.Descripcion || tipoEnfermedad.descripcion || 'No hay descripción disponible'}
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

export default TipoEnfermedadVer; 