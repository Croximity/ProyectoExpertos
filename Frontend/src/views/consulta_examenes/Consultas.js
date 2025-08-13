import React, { useEffect, useState } from 'react';
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
  Spinner,
  Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { useNavigate } from 'react-router-dom';
import { consultaService } from '../../services/consulta_examenes/consultaService';

const Consultas = () => {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarConsultas();
  }, []);

  const cargarConsultas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await consultaService.obtenerConsultas();
      setConsultas(Array.isArray(data) ? data : []);
    } catch (err) {
      let msg = 'Error al cargar las consultas';
      if (err.status === 401) msg = 'No autorizado. Inicie sesión.';
      if (err.status === 403) msg = 'Acceso denegado.';
      if (err.status === 404) msg = 'Servicio no disponible.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = () => navigate('/admin/consulta-examenes/consultas/nueva');
  const handleEditar = (id) => navigate(`/admin/consulta-examenes/consultas/editar/${id}`);
  const handleVer = (id) => navigate(`/admin/consulta-examenes/consultas/ver/${id}`);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta consulta?')) return;
    try {
      await consultaService.eliminarConsulta(id);
      await cargarConsultas();
      alert('Consulta eliminada');
    } catch (err) {
      alert('No se pudo eliminar la consulta');
    }
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
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Gestión de Consultas
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
                  <Button color="success" size="sm" onClick={handleCrear}>
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Nueva Consulta
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <p className="mt-2">Cargando consultas...</p>
                  </div>
                ) : error ? (
                  <Alert color="danger">
                    {error}
                    <div>
                      <Button color="outline-danger" size="sm" className="mt-2" onClick={cargarConsultas}>
                        Reintentar
                      </Button>
                    </div>
                  </Alert>
                ) : (
                  <>
                    <div className="mb-3">
                      <strong>Total de consultas: {consultas.length}</strong>
                    </div>
                    <Table className="align-items-center table-flush" responsive>
                      <thead className="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>Empleado</th>
                          <th>Fecha</th>
                          <th>Motivo</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultas.length > 0 ? (
                          consultas.map((c) => (
                            <tr key={c.idConsulta || c.id}>
                              <td>
                                <Badge color="primary" pill>
                                  {c.idConsulta || c.id}
                                </Badge>
                              </td>
                              <td>
                                <Badge color="info" pill>
                                  {c.idCliente}
                                </Badge>
                              </td>
                              <td>
                                <Badge color="warning" pill>
                                  {c.idEmpleado}
                                </Badge>
                              </td>
                              <td>{new Date(c.Fecha_consulta).toLocaleDateString()}</td>
                              <td>{c.Motivo_consulta}</td>
                              <td>
                                <Button color="info" size="sm" className="mr-2" onClick={() => handleVer(c.idConsulta || c.id)}>
                                  Ver
                                </Button>
                                <Button color="warning" size="sm" className="mr-2" onClick={() => handleEditar(c.idConsulta || c.id)}>
                                  Editar
                                </Button>
                                <Button color="danger" size="sm" onClick={() => handleEliminar(c.idConsulta || c.id)}>
                                  Eliminar
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              <Alert color="warning">No se encontraron consultas</Alert>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Consultas;


