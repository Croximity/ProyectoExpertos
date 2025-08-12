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
  faStethoscope,
  faVirus,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { diagnosticoService } from '../../services/consulta_examenes/diagnosticoService';
import { tipoEnfermedadService } from '../../services/consulta_examenes/tipoEnfermedadService';

const DiagnosticoVer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnostico, setDiagnostico] = useState(null);
  const [tipoEnfermedad, setTipoEnfermedad] = useState(null);
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
      
      // Cargar información del tipo de enfermedad si existe
      if (data.idTipoEnfermedad) {
        try {
          const tipoData = await tipoEnfermedadService.obtenerTipoEnfermedadPorId(data.idTipoEnfermedad);
          setTipoEnfermedad(tipoData);
        } catch (error) {
          console.error('Error al cargar tipo de enfermedad:', error);
        }
      }
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

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
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
                          {diagnostico.idDiagnostico}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>ID Examen:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="info" pill>
                          {diagnostico.idExamen}
                        </Badge>
                      </Col>
                    </Row>

                  </Col>
                  <Col md="6">
                    <h5>Información del Tipo de Enfermedad</h5>
                    <hr />
                    <Row>
                      <Col sm="4">
                        <strong>ID Tipo Enfermedad:</strong>
                      </Col>
                      <Col sm="8">
                        <Badge color="warning" pill>
                          {diagnostico.idTipoEnfermedad}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Nombre:</strong>
                      </Col>
                      <Col sm="8">
                        <FontAwesomeIcon icon={faVirus} className="mr-1" />
                        {tipoEnfermedad ? (tipoEnfermedad.Nombre || tipoEnfermedad.nombre) : 'N/A'}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Descripción:</strong>
                      </Col>
                      <Col sm="8">
                        {tipoEnfermedad ? (tipoEnfermedad.Descripcion || tipoEnfermedad.descripcion || 'Sin descripción') : 'N/A'}
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