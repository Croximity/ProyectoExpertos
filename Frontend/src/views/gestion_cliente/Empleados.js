import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
} from "reactstrap";

// Header del dashboard
import HeaderBlanco from "components/Headers/HeaderBlanco.js";
import { useNavigate } from 'react-router-dom';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { useToast } from '../../hooks/useToast';

const Empleados = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCorreo, setSearchCorreo] = useState('');
  const [searchDNI, setSearchDNI] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await empleadoService.obtenerEmpleados();
        setEmpleados(data);
      } catch (_) {
        showError('Error al cargar empleados');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [showError]);

  const handleEditar = (id) => {
    navigate(`/admin/empleados/editar/${id}`);
  };

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await empleadoService.obtenerEmpleados();
      setEmpleados(data);
    } catch (_) {
      showError('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      console.log('Iniciando búsqueda de empleados con términos:', { searchTerm, searchCorreo, searchDNI });
      setLoading(true);
      const filtros = {};
      
      // Procesar búsqueda por nombre/apellido
      if (searchTerm.trim()) {
        const searchValue = searchTerm.trim();
        console.log('Valor de búsqueda procesado:', searchValue);
        
        // Si hay espacios, separar nombre y apellido de manera inteligente
        if (searchValue.includes(' ')) {
          const parts = searchValue.split(' ').filter(part => part.length > 0);
          console.log('Partes de búsqueda con espacios:', parts);
          
          if (parts.length >= 2) {
            // Si hay 2 o más partes, la primera es nombre y la segunda es apellido
            filtros.Pnombre = parts[0];
            filtros.Papellido = parts[1];
            console.log('Búsqueda por nombre y apellido separados:', filtros);
          } else {
            // Solo una parte después de espacios, buscar en ambos campos
            filtros.Pnombre = searchValue;
            filtros.Papellido = searchValue;
            console.log('Búsqueda en ambos campos (espacios):', filtros);
          }
        } else {
          // Un solo término, buscar en nombres Y apellidos para mayor flexibilidad
          filtros.Pnombre = searchValue;
          filtros.Papellido = searchValue;
          console.log('Búsqueda en nombres y apellidos:', filtros);
        }
      }
      
      // Agregar filtros de correo y DNI si están presentes
      if (searchCorreo.trim()) {
        filtros.correo = searchCorreo.trim();
      }
      if (searchDNI.trim()) {
        filtros.DNI = searchDNI.trim();
      }
      
      console.log('Filtros construidos para empleados:', filtros);
      console.log('Llamando a empleadoService.obtenerEmpleados con filtros:', filtros);
      
      const empleadosData = await empleadoService.obtenerEmpleados(filtros);
      console.log('Respuesta del servicio empleados:', empleadosData);
      console.log('Número de resultados empleados:', empleadosData.length);
      
      setEmpleados(empleadosData);
    } catch (error) {
      console.error('Error completo en búsqueda empleados:', error);
      console.error('Error response empleados:', error.response);
      showError('Error al buscar empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setSearchTerm('');
    setSearchCorreo('');
    setSearchDNI('');
    cargar();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;
    try {
      await empleadoService.eliminarEmpleado(id);
      setEmpleados(prev => prev.filter(e => e.idEmpleado !== id));
      showSuccess('Empleado eliminado');
    } catch (_) {
      showError('Error al eliminar el empleado');
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
                <h3 className="mb-0">Gestión de Empleados</h3>
                <Button color="success" size="sm" onClick={() => navigate('/admin/empleados/nuevo')}>
                  Registrar Empleado
                </Button>
              </CardHeader>
              <CardBody>
                {/* Búsqueda */}
                <div className="d-flex gap-2 mb-3" style={{ gap: 8 }}>
                  <input
                    className="form-control"
                    placeholder="Buscar por nombre, apellido o ambos (ej: 'Juan Pérez' o 'Juan' o 'Pérez')"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    style={{ maxWidth: 400 }}
                  />
                  <input
                    className="form-control"
                    placeholder="Buscar por correo"
                    value={searchCorreo}
                    onChange={(e) => setSearchCorreo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    style={{ maxWidth: 200 }}
                  />
                  <input
                    className="form-control"
                    placeholder="Buscar por DNI"
                    value={searchDNI}
                    onChange={(e) => setSearchDNI(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    style={{ maxWidth: 150 }}
                  />
                  <Button color="primary" onClick={handleSearch} disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Button>
                  <Button color="secondary" onClick={handleLimpiar} disabled={loading}>
                    Limpiar
                  </Button>
                </div>
                {searchTerm || searchCorreo || searchDNI ? (
                  <div className="mb-3">
                    <small className="text-muted">
                      {searchTerm && `Nombre/Apellido: "${searchTerm}"`}
                      {searchTerm && searchCorreo && `, `}
                      {searchCorreo && `Correo: "${searchCorreo}"`}
                      {searchTerm && searchCorreo && searchDNI && `, `}
                      {searchDNI && `DNI: "${searchDNI}"`}
                    </small>
                  </div>
                ) : null}

                {/* Tabla */}
                {loading ? (
                  <div>Cargando...</div>
                ) : (
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>DNI</th>
                        <th>Correo</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empleados.map((empleado) => (
                        <tr key={empleado.idEmpleado}>
                          <td>{empleado.idEmpleado}</td>
                          <td>
                            {empleado.persona ? 
                              `${empleado.persona.Pnombre || ''} ${empleado.persona.Snombre || ''} ${empleado.persona.Papellido || ''} ${empleado.persona.Sapellido || ''}`.trim() 
                              : '—'
                            }
                          </td>
                          <td>{empleado.persona?.DNI || '—'}</td>
                          <td>{empleado.persona?.correo || '—'}</td>
                          <td>
                            {empleado.Fecha_Registro ? 
                              new Date(empleado.Fecha_Registro).toLocaleDateString() 
                              : '—'
                            }
                          </td>
                          <td>
                            <Button 
                              color="info" 
                              size="sm" 
                              className="mr-2" 
                              onClick={() => handleEditar(empleado.idEmpleado)}
                            >
                              Editar
                            </Button>
                            <Button 
                              color="danger" 
                              size="sm" 
                              onClick={() => handleEliminar(empleado.idEmpleado)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
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

export default Empleados;

