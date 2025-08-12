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
  faPrescription
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { recetaService } from '../../services/consulta_examenes/recetaService';

const RecetaVer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarReceta();
  }, [id]);

  const cargarReceta = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recetaService.obtenerRecetaPorId(id);
      setReceta(data);
    } catch (error) {
      console.error('Error al cargar receta:', error);
      setError('Error al cargar los datos de la receta');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/admin/consulta-examenes/recetas');
  };

  const handleEditar = () => {
    navigate(`/admin/consulta-examenes/recetas/editar/${id}`);
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
                  <p className="mt-2">Cargando receta...</p>
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

  if (!receta) {
    return (
      <>
        <HeaderBlanco />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody>
                  <Alert color="warning">
                    <strong>Advertencia:</strong> No se encontró la receta
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
                  <FontAwesomeIcon icon={faPrescription} className="mr-2" />
                  Detalles de Receta Médica
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
                        <strong>ID Receta:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="primary" pill>
                          {receta.idReceta || receta.id}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>ID Consulta:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="info" pill>
                          {receta.idConsulta || 'N/A'}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Fecha:</strong>
                      </Col>
                      <Col sm="8">
                        {receta.Fecha || receta.fecha || 'N/A'}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Estado:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color={receta.Estado === 'Activa' ? 'success' : 'warning'} pill>
                          {receta.Estado || receta.estado || 'N/A'}
                        </Badge>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="6">
                    <h5>Descripción</h5>
                    <hr />
                    <p>
                      {receta.Descripcion || receta.descripcion || 'No hay descripción disponible'}
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

export default RecetaVer; 