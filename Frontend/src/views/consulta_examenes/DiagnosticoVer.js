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
  faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { diagnosticoService } from '../../services/consulta_examenes/diagnosticoService';

const DiagnosticoVer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnostico, setDiagnostico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDiagnostico();
  }, [id]);

  const cargarDiagnostico = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await diagnosticoService.obtenerDiagnosticoPorId(id);
      setDiagnostico(data);
    } catch (error) {
      console.error('Error al cargar diagnóstico:', error);
      setError('Error al cargar los datos del diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/admin/consulta-examenes/diagnosticos');
  };

  const handleEditar = () => {
    navigate(`/admin/consulta-examenes/diagnosticos/editar/${id}`);
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
                  <p className="mt-2">Cargando diagnóstico...</p>
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

  if (!diagnostico) {
    return (
      <>
        <HeaderBlanco />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody>
                  <Alert color="warning">
                    <strong>Advertencia:</strong> No se encontró el diagnóstico
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
                  <FontAwesomeIcon icon={faStethoscope} className="mr-2" />
                  Detalles de Diagnóstico
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
                        <strong>ID Diagnóstico:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="primary" pill>
                          {diagnostico.idDiagnostico || diagnostico.id}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>ID Consulta:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="info" pill>
                          {diagnostico.idConsulta || 'N/A'}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Fecha:</strong>
                      </Col>
                      <Col sm="8">
                        {diagnostico.Fecha || diagnostico.fecha || 'N/A'}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Estado:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color={diagnostico.Estado === 'Confirmado' ? 'success' : 'warning'} pill>
                          {diagnostico.Estado || diagnostico.estado || 'N/A'}
                        </Badge>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="6">
                    <h5>Diagnóstico</h5>
                    <hr />
                    <Row>
                      <Col sm="4">
                        <strong>Tipo de Enfermedad:</strong>
                      </Col>
                      <Col sm="8">
                        {diagnostico.TipoEnfermedad || diagnostico.tipoEnfermedad || 'N/A'}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Descripción:</strong>
                      </Col>
                      <Col sm="8">
                        {diagnostico.Descripcion || diagnostico.descripcion || 'No hay descripción disponible'}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Tratamiento:</strong>
                      </Col>
                      <Col sm="8">
                        {diagnostico.Tratamiento || diagnostico.tratamiento || 'No hay tratamiento especificado'}
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

export default DiagnosticoVer; 