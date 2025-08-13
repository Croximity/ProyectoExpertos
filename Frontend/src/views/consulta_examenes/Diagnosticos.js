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
  Spinner,
  Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faClipboardCheck,
  faArrowLeft,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { diagnosticoService } from '../../services/consulta_examenes/diagnosticoService';
import { tipoEnfermedadService } from '../../services/consulta_examenes/tipoEnfermedadService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Diagnosticos = () => {
  const navigate = useNavigate();
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [tiposEnfermedad, setTiposEnfermedad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar diagnósticos y tipos de enfermedad en paralelo
      const [diagnosticosData, tiposData] = await Promise.all([
        diagnosticoService.obtenerDiagnosticos(),
        tipoEnfermedadService.obtenerTiposEnfermedad()
      ]);
      
      setDiagnosticos(Array.isArray(diagnosticosData) ? diagnosticosData : []);
      setTiposEnfermedad(Array.isArray(tiposData) ? tiposData : []);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      
      let errorMessage = 'Error al cargar los datos';
      
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 401) {
          errorMessage = 'Error de autenticación. Los diagnósticos se mostrarán en modo de solo lectura.';
        } else if (error.response.status === 403) {
          errorMessage = 'No tiene permisos para acceder a esta información.';
        } else if (error.response.status === 404) {
          errorMessage = 'El servicio solicitado no está disponible.';
        } else if (error.response.status === 500) {
          errorMessage = 'Error interno del servidor. Los diagnósticos se mostrarán en modo de solo lectura.';
        } else {
          errorMessage = `Error del servidor: ${error.response.status}`;
        }
      } else if (error.request) {
        // La petición fue hecha pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor. Verifique que el backend esté funcionando.';
      } else {
        // Algo pasó al configurar la petición
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setDiagnosticos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = () => {
      navigate('/admin/consulta-examenes/diagnosticos/nuevo');
  };

  const handleEditar = (id) => {
      navigate(`/admin/consulta-examenes/diagnosticos/editar/${id}`);

  };

  const handleVer = (id) => {
    navigate(`/admin/consulta-examenes/diagnosticos/ver/${id}`);
  };

  const handleEliminar = async (id) => {

      if (window.confirm('¿Está seguro de que desea eliminar este diagnóstico?')) {
        try {
          await diagnosticoService.eliminarDiagnostico(id);
          cargarDatos();
          alert('Diagnóstico eliminado exitosamente');
        } catch (error) {
          console.error('Error al eliminar diagnóstico:', error);
          alert('Error al eliminar el diagnóstico');
        }
      }

  };

  const getNombreTipoEnfermedad = (idTipoEnfermedad) => {
    const tipo = tiposEnfermedad.find(t => t.idTipoEnfermedad === idTipoEnfermedad);
    return tipo ? (tipo.Nombre || tipo.nombre) : `Tipo ID: ${idTipoEnfermedad}`;
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
                  <FontAwesomeIcon icon={faClipboardCheck} className="mr-2" />
                  Gestión de Diagnósticos
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
                    Nuevo Diagnóstico
                  </Button>
                </div>
              </CardHeader>

              <CardBody>
                {loading ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <p className="mt-2">Cargando diagnósticos...</p>
                  </div>
                ) : error ? (
                  <Alert color="danger">
                    <strong>Error:</strong> {error}
                    <br />
                    <Button color="outline-danger" size="sm" onClick={cargarDatos} className="mt-2">
                      Reintentar
                    </Button>
                  </Alert>
                ) : (
                  <>
                    <div className="mb-3">
                      <strong>Total de diagnósticos: {diagnosticos.length}</strong>
                    </div>
                    <Table className="align-items-center table-flush" responsive>
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">ID Examen</th>
                          <th scope="col">Tipo de Enfermedad</th>
                          <th scope="col">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosticos.length > 0 ? diagnosticos.map((diagnostico) => (
                          <tr key={diagnostico.idDiagnostico}>
                            <td>
                              <Badge color="primary" pill>
                                {diagnostico.idDiagnostico}
                              </Badge>
                            </td>
                            <td>
                              <Badge color="info" pill>
                                {diagnostico.idExamen}
                              </Badge>
                            </td>
                            <td>
                              <div>
                                <strong>{getNombreTipoEnfermedad(diagnostico.idTipoEnfermedad)}</strong>
                                <br />
                                <small className="text-muted">ID: {diagnostico.idTipoEnfermedad}</small>
                              </div>
                            </td>

                            <td>
                              <Button
                                color="info"
                                size="sm"
                                className="mr-2"
                                onClick={() => handleVer(diagnostico.idDiagnostico)}
                              >
                                Ver
                              </Button>
                              
                                <>
                                  <Button
                                    color="warning"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => handleEditar(diagnostico.idDiagnostico)}
                                    title="Editar diagnóstico"
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleEliminar(diagnostico.idDiagnostico)}
                                    title="Eliminar diagnóstico"
                                  >
                                    Eliminar
                                  </Button>
                                </>
                              
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              <Alert color="warning">
                                No se encontraron diagnósticos
                                <br />
                                <small>Esto puede deberse a que no hay datos en la base de datos o hay un problema de conexión</small>
                                <br />
                                <Button 
                                  color="outline-warning" 
                                  size="sm" 
                                  onClick={cargarDatos} 
                                  className="mt-2"
                                >
                                  Reintentar
                                </Button>
                              </Alert>
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

export default Diagnosticos;
