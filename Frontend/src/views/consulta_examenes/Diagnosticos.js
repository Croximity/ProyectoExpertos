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
  faClipboardCheck,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { diagnosticoService } from '../../services/consulta_examenes/diagnosticoService';
import { useNavigate } from 'react-router-dom';

const Diagnosticos = () => {
  const navigate = useNavigate();
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDiagnosticos();
  }, []);

  const cargarDiagnosticos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await diagnosticoService.obtenerDiagnosticos();
      setDiagnosticos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar diagnósticos:', error);
      setError('Error al cargar los diagnósticos');
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
        cargarDiagnosticos();
        alert('Diagnóstico eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar diagnóstico:', error);
        alert('Error al eliminar el diagnóstico');
      }
    }
  };

  const truncateText = (text, maxLength = 80) => {
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
                  </Alert>
                ) : (
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">ID Examen</th>
                        <th scope="col">Tipo Enfermedad</th>
                        <th scope="col">Fecha Creación</th>
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
                            <Badge color="warning" pill>
                              {diagnostico.idTipoEnfermedad}
                            </Badge>
                          </td>
                          <td>
                            {diagnostico.createdAt ? 
                              new Date(diagnostico.createdAt).toLocaleDateString('es-ES') : 
                              'N/A'
                            }
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
                            <Button
                              color="warning"
                              size="sm"
                              className="mr-2"
                              onClick={() => handleEditar(diagnostico.idDiagnostico)}
                            >
                              Editar
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleEliminar(diagnostico.idDiagnostico)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No se encontraron diagnósticos
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

export default Diagnosticos;
