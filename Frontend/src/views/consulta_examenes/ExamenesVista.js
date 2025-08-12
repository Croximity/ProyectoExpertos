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
  faStethoscope,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { examenVistaService } from '../../services/consulta_examenes/examenVistaService';
import { useNavigate } from 'react-router-dom';

const ExamenesVista = () => {
  const navigate = useNavigate();
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    idConsulta: '',
    idReceta: '',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    cargarExamenes();
  }, []);

  const cargarExamenes = async (filtrosActuales = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await examenVistaService.obtenerExamenesVista(filtrosActuales);
      setExamenes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar exámenes:', error);
      setError('Error al cargar los exámenes de vista');
      setExamenes([]);
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
    cargarExamenes(filtrosLimpios);
  };

  const limpiarFiltros = () => {
    setFiltros({
      idConsulta: '',
      idReceta: '',
      fechaInicio: '',
      fechaFin: ''
    });
    cargarExamenes();
  };

  const handleCrear = () => {
    navigate('/admin/consulta-examenes/examenes-vista/nuevo');
  };

  const handleEditar = (id) => {
    navigate(`/admin/consulta-examenes/examenes-vista/editar/${id}`);
  };

  const handleVer = (id) => {
    navigate(`/admin/consulta-examenes/examenes-vista/ver/${id}`);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este examen de vista?')) {
      try {
        await examenVistaService.eliminarExamenVista(id);
        cargarExamenes();
        alert('Examen eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar examen:', error);
        alert('Error al eliminar el examen');
      }
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES');
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
                  <FontAwesomeIcon icon={faStethoscope} className="mr-2" />
                  Gestión de Exámenes de Vista
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
                    Nuevo Examen
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
                      size="sm"
                    />
                  </Col>
                  <Col md="2">
                    <Input
                      type="number"
                      name="idReceta"
                      value={filtros.idReceta}
                      onChange={handleFiltroChange}
                      placeholder="ID Receta"
                      size="sm"
                    />
                  </Col>
                  <Col md="3">
                    <Input
                      type="date"
                      name="fechaInicio"
                      value={filtros.fechaInicio}
                      onChange={handleFiltroChange}
                      size="sm"
                    />
                  </Col>
                  <Col md="3">
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
                    <p className="mt-2">Cargando exámenes...</p>
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
                        <th scope="col">ID Receta</th>
                        <th scope="col">Fecha Examen</th>
                        <th scope="col">Observaciones</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examenes.length > 0 ? examenes.map((examen) => (
                        <tr key={examen.idExamen}>
                          <td>
                            <Badge color="primary" pill>
                              {examen.idExamen}
                            </Badge>
                          </td>
                          <td>
                            <Badge color="info" pill>
                              {examen.idConsulta}
                            </Badge>
                          </td>
                          <td>
                            {examen.idReceta ? (
                              <Badge color="success" pill>
                                {examen.idReceta}
                              </Badge>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                          <td>{formatearFecha(examen.Fecha_Examen)}</td>
                          <td>{truncateText(examen.Observaciones)}</td>
                          <td>
                            <Button
                              color="info"
                              size="sm"
                              className="mr-2"
                              onClick={() => handleVer(examen.idExamen)}
                            >
                              Ver
                            </Button>
                            <Button
                              color="warning"
                              size="sm"
                              className="mr-2"
                              onClick={() => handleEditar(examen.idExamen)}
                            >
                              Editar
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleEliminar(examen.idExamen)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No se encontraron exámenes de vista
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

export default ExamenesVista;
