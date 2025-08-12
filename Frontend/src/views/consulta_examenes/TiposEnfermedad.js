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
  faVirus,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { tipoEnfermedadService } from '../../services/consulta_examenes/tipoEnfermedadService';
import { useNavigate } from 'react-router-dom';

const TiposEnfermedad = () => {
  const navigate = useNavigate();
  const [tiposEnfermedad, setTiposEnfermedad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarTiposEnfermedad();
  }, []);

  const cargarTiposEnfermedad = async (filtrosActuales = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await tipoEnfermedadService.obtenerTiposEnfermedad(filtrosActuales);
      setTiposEnfermedad(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar tipos de enfermedad:', error);
      setError('Error al cargar los tipos de enfermedad');
      setTiposEnfermedad([]);
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
    cargarTiposEnfermedad(filtrosLimpios);
  };

  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      descripcion: ''
    });
    cargarTiposEnfermedad();
  };

  const handleCrear = () => {
    console.log('Navegando a crear tipo de enfermedad');
    try {
      navigate('/admin/consulta-examenes/tipos-enfermedad/nuevo');
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  const handleEditar = (id) => {
    console.log('Navegando a editar tipo de enfermedad con ID:', id);
    try {
      navigate(`/admin/consulta-examenes/tipos-enfermedad/editar/${id}`);
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  const handleVer = (id) => {
    console.log('Navegando a ver tipo de enfermedad con ID:', id);
    try {
      navigate(`/admin/consulta-examenes/tipos-enfermedad/ver/${id}`);
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  const handleEliminar = async (id) => {
    console.log('Intentando eliminar tipo de enfermedad con ID:', id);
    if (window.confirm('¿Está seguro de que desea eliminar este tipo de enfermedad?')) {
      try {
        console.log('Eliminando tipo de enfermedad...');
        const response = await tipoEnfermedadService.eliminarTipoEnfermedad(id);
        console.log('Respuesta del servidor:', response);
        console.log('Tipo de enfermedad eliminado exitosamente');
        cargarTiposEnfermedad();
        alert('Tipo de enfermedad eliminado exitosamente');
      } catch (error) {
        console.error('Error completo al eliminar tipo de enfermedad:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        alert('Error al eliminar el tipo de enfermedad: ' + (error.message || 'Error desconocido'));
      }
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

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
                  Gestión de Tipos de Enfermedad
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
                    Nuevo Tipo
                  </Button>
                </div>
              </CardHeader>

              {/* Filtros */}
              <CardBody className="border-bottom">
                <Row>
                  <Col md="4">
                    <Input
                      type="text"
                      name="nombre"
                      value={filtros.nombre}
                      onChange={handleFiltroChange}
                      placeholder="Filtrar por nombre"
                      bsSize="sm"
                    />
                  </Col>
                  <Col md="4">
                    <Input
                      type="text"
                      name="descripcion"
                      value={filtros.descripcion}
                      onChange={handleFiltroChange}
                      placeholder="Filtrar por descripción"
                      bsSize="sm"
                    />
                  </Col>
                  <Col md="4">
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
                    <p className="mt-2">Cargando tipos de enfermedad...</p>
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
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tiposEnfermedad.length > 0 ? tiposEnfermedad.map((tipo) => (
                        <tr key={tipo.idTipoEnfermedad || tipo.id}>
                          <td>
                            <Badge color="primary" pill>
                              {tipo.idTipoEnfermedad || tipo.id}
                            </Badge>
                          </td>
                          <td>
                            <strong>{tipo.Nombre || tipo.nombre}</strong>
                          </td>
                          <td>{truncateText(tipo.Descripcion || tipo.descripcion)}</td>
                          <td>
                            <Button
                              color="info"
                              size="sm"
                              className="mr-2"
                              onClick={() => handleVer(tipo.idTipoEnfermedad || tipo.id)}
                            >
                              Ver
                            </Button>
                            <Button
                              color="warning"
                              size="sm"
                              className="mr-2"
                              onClick={() => handleEditar(tipo.idTipoEnfermedad || tipo.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleEliminar(tipo.idTipoEnfermedad || tipo.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No se encontraron tipos de enfermedad
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

export default TiposEnfermedad;
