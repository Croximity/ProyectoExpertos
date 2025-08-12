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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner,
  Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye, 
  faSearch,
  faFilter,
  faPrescription,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { recetaService } from '../../services/consulta_examenes/recetaService';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { useNavigate } from 'react-router-dom';

const Recetas = () => {
  const navigate = useNavigate();
  const [recetas, setRecetas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    idCliente: '',
    idEmpleado: '',
    tipoLente: '',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar recetas, clientes y empleados en paralelo
      const [recetasData, clientesData, empleadosData] = await Promise.all([
        recetaService.obtenerRecetas(),
        clienteService.obtenerClientes(),
        empleadoService.obtenerEmpleados()
      ]);
      
      setRecetas(Array.isArray(recetasData) ? recetasData : []);
      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos');
      setRecetas([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarRecetas = async (filtrosActuales = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await recetaService.obtenerRecetas(filtrosActuales);
      setRecetas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar recetas:', error);
      setError('Error al cargar las recetas');
      setRecetas([]);
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
    cargarRecetas(filtrosLimpios);
  };

  const limpiarFiltros = () => {
    setFiltros({
      idCliente: '',
      idEmpleado: '',
      tipoLente: '',
      fechaInicio: '',
      fechaFin: ''
    });
    cargarRecetas();
  };

  const handleCrear = () => {
    navigate('/admin/consulta-examenes/recetas/nuevo');
  };

  const handleEditar = (id) => {
    navigate(`/admin/consulta-examenes/recetas/editar/${id}`);
  };

  const handleVer = (id) => {
    navigate(`/admin/consulta-examenes/recetas/ver/${id}`);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta receta?')) {
      try {
        await recetaService.eliminarReceta(id);
        cargarRecetas();
        alert('Receta eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar receta:', error);
        alert('Error al eliminar la receta');
      }
    }
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

  const getNombreCompletoCliente = (idCliente) => {
    const cliente = clientes.find(c => c.idCliente === idCliente);
    if (!cliente || !cliente.persona) return `Cliente ID: ${idCliente}`;
    const persona = cliente.persona;
    return `${persona.Pnombre || ''} ${persona.Snombre || ''} ${persona.Papellido || ''} ${persona.Sapellido || ''}`.trim() || `Cliente ID: ${idCliente}`;
  };

  const getNombreCompletoEmpleado = (idEmpleado) => {
    const empleado = empleados.find(e => e.idEmpleado === idEmpleado);
    if (!empleado || !empleado.persona) return `Empleado ID: ${idEmpleado}`;
    const persona = empleado.persona;
    return `${persona.Pnombre || ''} ${persona.Snombre || ''} ${persona.Papellido || ''} ${persona.Sapellido || ''}`.trim() || `Empleado ID: ${idEmpleado}`;
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
                  <FontAwesomeIcon icon={faPrescription} className="mr-2" />
                  Gestión de Recetas
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
                    Nueva Receta
                  </Button>
                </div>
              </CardHeader>

              {/* Filtros */}
              <CardBody className="border-bottom">
                <Row>
                  <Col md="2">
                    <Input
                      type="number"
                      name="idCliente"
                      value={filtros.idCliente}
                      onChange={handleFiltroChange}
                      placeholder="ID Cliente"
                      size="sm"
                    />
                  </Col>
                  <Col md="2">
                    <Input
                      type="number"
                      name="idEmpleado"
                      value={filtros.idEmpleado}
                      onChange={handleFiltroChange}
                      placeholder="ID Empleado"
                      size="sm"
                    />
                  </Col>
                  <Col md="2">
                    <Input
                      type="text"
                      name="tipoLente"
                      value={filtros.tipoLente}
                      onChange={handleFiltroChange}
                      placeholder="Tipo de Lente"
                      size="sm"
                    />
                  </Col>
                  <Col md="2">
                    <Input
                      type="date"
                      name="fechaInicio"
                      value={filtros.fechaInicio}
                      onChange={handleFiltroChange}
                      size="sm"
                    />
                  </Col>
                  <Col md="2">
                    <Input
                      type="date"
                      name="fechaFin"
                      value={filtros.fechaFin}
                      onChange={handleFiltroChange}
                      size="sm"
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
                    <p className="mt-2">Cargando recetas...</p>
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
                        <th scope="col">Cliente</th>
                        <th scope="col">Empleado</th>
                        <th scope="col">Agudeza Visual</th>
                        <th scope="col">Tipo Lente</th>
                        <th scope="col">Fecha de Creación</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recetas.length > 0 ? recetas.map((receta) => (
                        <tr key={receta.idReceta}>
                          <td>
                            <Badge color="primary" pill>
                              {receta.idReceta}
                            </Badge>
                          </td>
                          <td>
                            <div>
                              <strong>{getNombreCompletoCliente(receta.idCliente)}</strong>
                              <br />
                              <small className="text-muted">ID: {receta.idCliente}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{getNombreCompletoEmpleado(receta.idEmpleado)}</strong>
                              <br />
                              <small className="text-muted">ID: {receta.idEmpleado}</small>
                            </div>
                          </td>
                          <td>{receta.Agudeza_Visual || 'N/A'}</td>
                          <td>
                            {receta.Tipo_Lente ? (
                              <Badge color="info" pill>
                                {receta.Tipo_Lente}
                              </Badge>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>
                            <div>
                              <strong>{formatearFecha(receta.Fecha)}</strong>
                            </div>
                          </td>
                          <td>
                            <Button
                              color="info"
                              size="sm"
                              className="mr-2"
                              onClick={() => handleVer(receta.idReceta)}
                            >
                              Ver
                            </Button>
                            <Button
                              color="warning"
                              size="sm"
                              className="mr-2"
                              onClick={() => handleEditar(receta.idReceta)}
                            >
                              Editar
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleEliminar(receta.idReceta)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No se encontraron recetas
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

export default Recetas;
