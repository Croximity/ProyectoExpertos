import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Input,
  Spinner,
  Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye, 
  faFilter,
  faTools,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import UserHeader from 'components/Headers/UserHeader.js';
import { reparacionLentesService } from '../../services/consulta_examenes/reparacionLentesService';
import { useNavigate } from 'react-router-dom';

const ReparacionLentes = () => {
  const navigate = useNavigate();
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    idConsulta: '',
    tipoReparacion: '',
    fechaInicio: '',
    fechaFin: '',
    estado: ''
  });

  useEffect(() => {
    cargarReparaciones();
  }, []);

  const cargarReparaciones = async (filtrosActuales = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reparacionLentesService.obtenerReparaciones(filtrosActuales);
      setReparaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar reparaciones:', error);
      setError('Error al cargar las reparaciones de lentes');
      setReparaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const aplicarFiltros = () => {
    const filtrosLimpios = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== '')
    );
    cargarReparaciones(filtrosLimpios);
  };

  const limpiarFiltros = () => {
    setFiltros({
      idConsulta: '',
      tipoReparacion: '',
      fechaInicio: '',
      fechaFin: '',
      estado: ''
    });
    cargarReparaciones();
  };

  const handleCrear = () => {
    console.log('Navegando a crear reparación de lentes');
    try {
      navigate('/admin/consulta-examenes/reparacion-lentes/nuevo');
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  const handleEditar = (id) => {
    console.log('Navegando a editar reparación de lentes con ID:', id);
    try {
      navigate(`/admin/consulta-examenes/reparacion-lentes/editar/${id}`);
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  const handleVer = (id) => {
    console.log('Navegando a ver reparación de lentes con ID:', id);
    try {
      navigate(`/admin/consulta-examenes/reparacion-lentes/ver/${id}`);
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  const handleEliminar = async (id) => {
    console.log('Intentando eliminar reparación de lentes con ID:', id);
    if (window.confirm('¿Está seguro de que desea eliminar esta reparación de lente?')) {
      try {
        console.log('Eliminando reparación de lentes...');
        const response = await reparacionLentesService.eliminarReparacionLente(id);
        console.log('Respuesta del servidor:', response);
        console.log('Reparación de lentes eliminada exitosamente');
        cargarReparaciones();
        alert('Reparación eliminada exitosamente');
      } catch (error) {
        console.error('Error completo al eliminar reparación:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        alert('Error al eliminar la reparación: ' + (error.message || 'Error desconocido'));
      }
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const obtenerColorEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'warning';
      case 'en proceso': return 'info';
      case 'completado': return 'success';
      case 'cancelado': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <FontAwesomeIcon icon={faTools} className="mr-2" />
                  Gestión de Reparación de Lentes
                </h3>
                <div>
                  <Button 
                    color="secondary" 
                    size="sm" 
                    onClick={() => navigate('/admin/consulta-examenes')}
                    className="mr-2"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                    Volver al Panel
                  </Button>
                  <Button 
                    color="success" 
                    size="sm" 
                    onClick={handleCrear}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Nueva Reparación
                  </Button>
                </div>
              </CardHeader>

              {/* Filtros */}
              <CardBody className="border-bottom">
                <Row>
                  <Col md="2">
                    <Input
                      type="number"
                      name="idConsulta"
                      value={filtros.idConsulta}
                      onChange={handleFiltroChange}
                      placeholder="ID Consulta"
                      bsSize="sm"
                    />
                  </Col>
                  <Col md="2">
                    <Input
                      type="text"
                      name="tipoReparacion"
                      value={filtros.tipoReparacion}
                      onChange={handleFiltroChange}
                      placeholder="Tipo reparación"
                      bsSize="sm"
                    />
                  </Col>
                  <Col md="2">
                    <Input
                      type="select"
                      name="estado"
                      value={filtros.estado}
                      onChange={handleFiltroChange}
                      bsSize="sm"
                    >
                      <option value="">Estado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </Input>
                  </Col>
                  <Col md="2">
                    <Input
                      type="date"
                      name="fechaInicio"
                      value={filtros.fechaInicio}
                      onChange={handleFiltroChange}
                      bsSize="sm"
                    />
                  </Col>
                  <Col md="2">
                    <Input
                      type="date"
                      name="fechaFin"
                      value={filtros.fechaFin}
                      onChange={handleFiltroChange}
                      bsSize="sm"
                    />
                  </Col>
                  <Col md="2">
                    <Button 
                      color="info" 
                      size="sm" 
                      onClick={aplicarFiltros}
                      className="mr-1"
                    >
                      <FontAwesomeIcon icon={faFilter} />
                    </Button>
                    <Button 
                      color="secondary" 
                      size="sm" 
                      onClick={limpiarFiltros}
                    >
                      Limpiar
                    </Button>
                  </Col>
                </Row>
              </CardBody>

              <CardBody>
                {loading ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <p className="mt-2">Cargando reparaciones...</p>
                  </div>
                ) : error ? (
                  <Alert color="danger">
                    <strong>Error:</strong> {error}
                  </Alert>
                ) : (
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">ID Consulta</th>
                        <th scope="col">Tipo Reparación</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Costo</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reparaciones.length > 0 ? reparaciones.map((reparacion, index) => (
                        <tr key={reparacion.idReparacionDeLentes || reparacion.id || `reparacion-${index}`}>
                          <td>
                            <Badge color="primary" pill>
                              {reparacion.idReparacionDeLentes || reparacion.id}
                            </Badge>
                          </td>
                          <td>
                            <Badge color="info" pill>
                              {reparacion.idConsulta || 'N/A'}
                            </Badge>
                          </td>
                          <td>
                            <strong>{truncateText(reparacion.Tipo_Reparacion || reparacion.tipoReparacion || reparacion.tipo_reparacion, 20)}</strong>
                          </td>
                          <td>{truncateText(reparacion.Descripcion || reparacion.descripcion)}</td>
                          <td>
                            <Badge color="success" pill>
                              L. {reparacion.Costo || reparacion.costo || 'N/A'}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              color="info"
                              size="sm"
                              className="mr-2"
                              onClick={() => handleVer(reparacion.idReparacionDeLentes || reparacion.id)}
                            >
                              Ver
                            </Button>
                            <Button
                              color="warning"
                              size="sm"
                              className="mr-2"
                              onClick={() => handleEditar(reparacion.idReparacionDeLentes || reparacion.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleEliminar(reparacion.idReparacionDeLentes || reparacion.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No se encontraron reparaciones de lentes
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ReparacionLentes;
