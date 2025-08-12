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
  faPrescription,
  faUser,
  faUserTie,
  faGlasses,
  faCalendarAlt,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { recetaService } from '../../services/consulta_examenes/recetaService';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';

const RecetaVer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receta, setReceta] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [empleado, setEmpleado] = useState(null);
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
      
      // Cargar información del cliente y empleado
      if (data.idCliente) {
        try {
          const clienteData = await clienteService.obtenerClientePorId(data.idCliente);
          setCliente(clienteData);
        } catch (error) {
          console.error('Error al cargar cliente:', error);
        }
      }
      
      if (data.idEmpleado) {
        try {
          const empleadoData = await empleadoService.obtenerEmpleadoPorId(data.idEmpleado);
          setEmpleado(empleadoData);
        } catch (error) {
          console.error('Error al cargar empleado:', error);
        }
      }
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

  const getNombreCompletoCliente = (cliente) => {
    if (!cliente || !cliente.persona) return 'N/A';
    const persona = cliente.persona;
    return `${persona.Pnombre || ''} ${persona.Snombre || ''} ${persona.Papellido || ''} ${persona.Sapellido || ''}`.trim() || 'N/A';
  };

  const getNombreCompletoEmpleado = (empleado) => {
    if (!empleado || !empleado.persona) return 'N/A';
    const persona = empleado.persona;
    return `${persona.Pnombre || ''} ${persona.Snombre || ''} ${persona.Papellido || ''} ${persona.Sapellido || ''}`.trim() || 'N/A';
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
                          {receta.idReceta}
                        </Badge>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Cliente:</strong>
                      </Col>
                      <Col sm="8">
                        <FontAwesomeIcon icon={faUser} className="mr-1" />
                        {getNombreCompletoCliente(cliente)}
                        <br />
                        <small className="text-muted">ID: {receta.idCliente}</small>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Empleado:</strong>
                      </Col>
                      <Col sm="8">
                        <FontAwesomeIcon icon={faUserTie} className="mr-1" />
                        {getNombreCompletoEmpleado(empleado)}
                        <br />
                        <small className="text-muted">ID: {receta.idEmpleado}</small>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Fecha de Creación:</strong>
                      </Col>
                      <Col sm="8">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {formatearFecha(receta.Fecha)}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Agudeza Visual:</strong>
                      </Col>
                      <Col sm="8">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        {receta.Agudeza_Visual || 'N/A'}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm="4">
                        <strong>Tipo de Lente:</strong>
                      </Col>
                      <Col sm="8">
                        {receta.Tipo_Lente ? (
                          <Badge color="info" pill>
                            {receta.Tipo_Lente}
                          </Badge>
                        ) : (
                          'N/A'
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col md="6">
                    <h5>
                      <FontAwesomeIcon icon={faGlasses} className="mr-2" />
                      Medidas Ópticas
                    </h5>
                    <hr />
                    <Row>
                      <Col sm="6">
                        <h6>Ojo Izquierdo</h6>
                        <p><strong>Esfera:</strong> {receta.EsferaIzquierdo || 'N/A'}</p>
                        <p><strong>Cilindro:</strong> {receta.Cilindro_Izquierdo || 'N/A'}</p>
                        <p><strong>Eje:</strong> {receta.Eje_Izquierdo || 'N/A'}</p>
                      </Col>
                      <Col sm="6">
                        <h6>Ojo Derecho</h6>
                        <p><strong>Esfera:</strong> {receta.Esfera_Derecho || 'N/A'}</p>
                        <p><strong>Cilindro:</strong> {receta.Cilindro_Derecho || 'N/A'}</p>
                        <p><strong>Eje:</strong> {receta.Eje_Derecho || 'N/A'}</p>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col sm="12">
                        <h6>Información Adicional</h6>
                        <p><strong>Distancia Pupilar:</strong> {receta.Distancia_Pupilar ? `${receta.Distancia_Pupilar} mm` : 'N/A'}</p>
                        <p><strong>Diagnóstico:</strong></p>
                        <div className="border rounded p-2 bg-light">
                          {receta.Diagnostico || 'No hay diagnóstico especificado'}
                        </div>
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

export default RecetaVer; 