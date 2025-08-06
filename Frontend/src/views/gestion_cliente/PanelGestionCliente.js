import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  CardGroup,
  CardText,
  CardTitle,
  Badge
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUserTie, 
  faChartLine, 
  faPlus,
  faSearch,
  faEye,
  faEdit,
  faTrash,
  faCalendarAlt,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faIdCard,
  faInfo
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { useToast } from '../../hooks/useToast';

const PanelGestionCliente = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalEmpleados: 0,
    clientesRecientes: 0,
    empleadosRecientes: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentClientes, setRecentClientes] = useState([]);
  const [recentEmpleados, setRecentEmpleados] = useState([]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const [clientes, empleados] = await Promise.all([
        clienteService.obtenerClientes(),
        empleadoService.obtenerEmpleados()
      ]);

      // Calcular estadísticas
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - 30); // Últimos 30 días

      const clientesRecientes = clientes.filter(cliente => 
        new Date(cliente.fechaRegistro) >= fechaLimite
      );

      const empleadosRecientes = empleados.filter(empleado => 
        new Date(empleado.Fecha_Registro) >= fechaLimite
      );

      setStats({
        totalClientes: clientes.length,
        totalEmpleados: empleados.length,
        clientesRecientes: clientesRecientes.length,
        empleadosRecientes: empleadosRecientes.length
      });

      // Obtener los 5 más recientes
      setRecentClientes(clientes.slice(0, 5));
      setRecentEmpleados(empleados.slice(0, 5));
    } catch (error) {
      showToast('Error al cargar estadísticas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getGeneroLabel = (genero) => {
    return genero === 'M' ? 'Masculino' : 'Femenino';
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 text-primary">
            <FontAwesomeIcon icon={faUsers} className="me-3" />
            Gestión de Clientes
          </h1>
          <p className="lead text-muted">
            Administra clientes y empleados de la óptica
          </p>
        </Col>
      </Row>

      {/* Estadísticas */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-left-primary shadow h-100">
            <CardBody>
              <Row noGutters className="align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Clientes
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loading ? '...' : stats.totalClientes}
                  </div>
                </Col>
                <Col className="col-auto">
                  <FontAwesomeIcon icon={faUsers} className="fa-2x text-gray-300" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-left-success shadow h-100">
            <CardBody>
              <Row noGutters className="align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Empleados
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loading ? '...' : stats.totalEmpleados}
                  </div>
                </Col>
                <Col className="col-auto">
                  <FontAwesomeIcon icon={faUserTie} className="fa-2x text-gray-300" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-left-info shadow h-100">
            <CardBody>
              <Row noGutters className="align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Clientes Nuevos (30 días)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loading ? '...' : stats.clientesRecientes}
                  </div>
                </Col>
                <Col className="col-auto">
                  <FontAwesomeIcon icon={faChartLine} className="fa-2x text-gray-300" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-left-warning shadow h-100">
            <CardBody>
              <Row noGutters className="align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Empleados Nuevos (30 días)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loading ? '...' : stats.empleadosRecientes}
                  </div>
                </Col>
                <Col className="col-auto">
                  <FontAwesomeIcon icon={faUserTie} className="fa-2x text-gray-300" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Acciones Rápidas */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow">
            <CardHeader className="bg-primary text-white">
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Acciones Rápidas
              </h4>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={6} className="mb-3">
                  <Button 
                    color="primary" 
                    size="lg" 
                    block
                    onClick={() => navigateTo('/admin/clientes')}
                  >
                    <FontAwesomeIcon icon={faUsers} className="me-2" />
                    Gestionar Clientes
                  </Button>
                </Col>
                <Col md={6} className="mb-3">
                  <Button 
                    color="success" 
                    size="lg" 
                    block
                    onClick={() => navigateTo('/admin/empleados')}
                  >
                    <FontAwesomeIcon icon={faUserTie} className="me-2" />
                    Gestionar Empleados
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Contenido Reciente */}
      <Row>
        {/* Clientes Recientes */}
        <Col lg={6} className="mb-4">
          <Card className="shadow">
            <CardHeader className="bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Clientes Recientes
              </h5>
              <Button 
                color="light" 
                size="sm"
                onClick={() => navigateTo('/admin/clientes')}
              >
                Ver Todos
              </Button>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-info" role="status">
                    <span className="sr-only">Cargando...</span>
                  </div>
                </div>
              ) : recentClientes.length === 0 ? (
                <p className="text-muted text-center">No hay clientes recientes</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentClientes.map((cliente) => (
                    <div key={cliente.idCliente} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">
                          {cliente.persona?.Pnombre} {cliente.persona?.Snombre} {cliente.persona?.Papellido} {cliente.persona?.Sapellido}
                        </h6>
                        <small className="text-muted">
                          <FontAwesomeIcon icon={faIdCard} className="me-1" />
                          {cliente.persona?.DNI || 'N/A'}
                        </small>
                        <br />
                        <small className="text-muted">
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                          Registrado: {formatDate(cliente.fechaRegistro)}
                        </small>
                      </div>
                      <Badge color="primary" pill>
                        Cliente
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Empleados Recientes */}
        <Col lg={6} className="mb-4">
          <Card className="shadow">
            <CardHeader className="bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faUserTie} className="me-2" />
                Empleados Recientes
              </h5>
              <Button 
                color="light" 
                size="sm"
                onClick={() => navigateTo('/admin/empleados')}
              >
                Ver Todos
              </Button>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Cargando...</span>
                  </div>
                </div>
              ) : recentEmpleados.length === 0 ? (
                <p className="text-muted text-center">No hay empleados recientes</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentEmpleados.map((empleado) => (
                    <div key={empleado.idEmpleado} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">
                          {empleado.persona?.Pnombre} {empleado.persona?.Snombre} {empleado.persona?.Papellido} {empleado.persona?.Sapellido}
                        </h6>
                        <small className="text-muted">
                          <FontAwesomeIcon icon={faIdCard} className="me-1" />
                          {empleado.persona?.DNI || 'N/A'}
                        </small>
                        <br />
                        <small className="text-muted">
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                          Registrado: {formatDate(empleado.Fecha_Registro)}
                        </small>
                      </div>
                      <Badge color="success" pill>
                        Empleado
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Información Adicional */}
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="bg-light">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faInfo} className="me-2" />
                Información del Sistema
              </h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={4}>
                  <div className="text-center">
                    <FontAwesomeIcon icon={faEnvelope} className="fa-3x text-primary mb-3" />
                    <h6>Notificaciones por Email</h6>
                    <p className="text-muted small">
                      Los clientes reciben un correo de bienvenida automáticamente al ser registrados.
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <FontAwesomeIcon icon={faSearch} className="fa-3x text-success mb-3" />
                    <h6>Búsqueda Avanzada</h6>
                    <p className="text-muted small">
                      Busca clientes y empleados por nombre, apellido o DNI de forma rápida y eficiente.
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <FontAwesomeIcon icon={faUsers} className="fa-3x text-info mb-3" />
                    <h6>Gestión Integrada</h6>
                    <p className="text-muted small">
                      Sistema unificado para gestionar tanto clientes como empleados con la misma base de datos de personas.
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PanelGestionCliente; 