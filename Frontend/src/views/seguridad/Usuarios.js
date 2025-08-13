import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col, Button, Table, Spinner, Alert, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/seguridad/authService';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.obtenerUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Gestión de Usuarios
                </h3>
                <div>
                  <Button color="secondary" size="sm" className="mr-2" onClick={() => navigate('/admin/index')}>
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Volver al Panel
                  </Button>
                  <Button color="success" size="sm" onClick={() => navigate('/admin/usuarios/nuevo')}>
                    <FontAwesomeIcon icon={faPlus} className="mr-1" /> Nuevo Usuario
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <div className="text-center"><Spinner color="primary" /></div>
                ) : error ? (
                  <Alert color="danger">{error}</Alert>
                ) : (
                  <>
                    <div className="mb-3">
                      <strong>Total de usuarios: {usuarios.length}</strong>
                    </div>
                    <Table responsive className="align-items-center table-flush">
                      <thead className="thead-light">
                        <tr>
                          <th>Usuario</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                      {usuarios.length > 0 ? usuarios.map(u => (
                        <tr key={u._id}>
                          <td className="font-weight-bold">{u.Nombre_Usuario}</td>
                          <td><Badge color={u.idrol?.nombre === 'Administrador' ? 'primary' : 'info'}>{u.idrol?.nombre || '-'}</Badge></td>
                          <td>{u.estado ? <Badge color="success">Activo</Badge> : <Badge color="secondary">Inactivo</Badge>}</td>
                          <td>
                            <Button size="sm" color="info" className="mr-2" onClick={() => navigate(`/admin/usuarios/editar/${u._id}`)}>Editar</Button>
                            <Button size="sm" color="danger" onClick={async () => {
                              if (!window.confirm('¿Eliminar usuario?')) return;
                              await authService.eliminarUsuarioAdmin(u._id);
                              cargar();
                            }}>Eliminar</Button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4"><Alert color="warning">No hay usuarios registrados</Alert></td>
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

export default Usuarios;


