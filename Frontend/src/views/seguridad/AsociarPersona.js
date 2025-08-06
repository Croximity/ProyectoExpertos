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
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faLink,
  faUser,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/seguridad/authService';
import { personaService } from '../../services/seguridad/personaService';
import { useToast } from '../../hooks/useToast';
import Header from 'components/Headers/Header.js';
import Toast from 'components/Toast/Toast';

const AsociarPersona = () => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usuariosData, personasData] = await Promise.all([
        authService.obtenerUsuarios(),
        personaService.obtenerPersonas()
      ]);
      setUsuarios(usuariosData);
      setPersonas(personasData);
    } catch (error) {
      showError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Implementar búsqueda si es necesario
  };

  const openModal = (usuario) => {
    setSelectedUsuario(usuario);
    setSelectedPersonaId('');
    setModalOpen(true);
  };

  const handleAsociar = async () => {
    try {
      if (!selectedPersonaId) {
        showError('Debe seleccionar una persona');
        return;
      }

      await authService.asociarPersonaAUsuario({
        idUsuario: selectedUsuario.idUsuario,
        idPersona: selectedPersonaId
      });

      showSuccess('Persona asociada exitosamente');
      setModalOpen(false);
      cargarDatos(); // Recargar datos
    } catch (error) {
      showError('Error al asociar persona');
    }
  };

  const getNombreCompleto = (persona) => {
    if (!persona) return 'N/A';
    return `${persona.Pnombre} ${persona.Snombre || ''} ${persona.Papellido || ''} ${persona.Sapellido || ''}`.trim();
  };

  const usuariosSinPersona = usuarios.filter(usuario => !usuario.idPersona);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      <FontAwesomeIcon icon={faLink} className="me-2" />
                      Asociar Personas a Usuarios
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Búsqueda */}
                <Row className="mb-4">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <FontAwesomeIcon icon={faSearch} />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={{ color: '#525f7f' }}
                      />
                      <InputGroupAddon addonType="append">
                        <Button color="primary" onClick={handleSearch}>
                          Buscar
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </Row>

                {/* Tabla */}
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Nombre de Usuario</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Persona Asociada</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Cargando...</span>
                          </div>
                        </td>
                      </tr>
                    ) : usuariosSinPersona.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          Todos los usuarios tienen persona asociada
                        </td>
                      </tr>
                    ) : (
                      usuariosSinPersona.map((usuario) => (
                        <tr key={usuario.idUsuario}>
                          <td>{usuario.idUsuario}</td>
                          <td>{usuario.Nombre_Usuario}</td>
                          <td>
                            <span className={`badge badge-${usuario.estado === 'Activo' ? 'success' : 'warning'}`}>
                              {usuario.estado}
                            </span>
                          </td>
                          <td>
                            <span className="text-danger">
                              <FontAwesomeIcon icon={faUser} className="me-1" />
                              Sin persona asociada
                            </span>
                          </td>
                          <td>
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => openModal(usuario)}
                            >
                              <FontAwesomeIcon icon={faLink} className="me-1" />
                              Asociar Persona
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Row>

        {/* Modal para asociar persona */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader toggle={() => setModalOpen(false)}>
            <FontAwesomeIcon icon={faLink} className="me-2" />
            Asociar Persona a Usuario
          </ModalHeader>
          <ModalBody>
            {selectedUsuario && (
              <div>
                <Alert color="info">
                  <strong>Usuario:</strong> {selectedUsuario.Nombre_Usuario} (ID: {selectedUsuario.idUsuario})
                </Alert>
                
                <FormGroup>
                  <Label>
                    <FontAwesomeIcon icon={faUsers} className="me-2" />
                    Seleccionar Persona *
                  </Label>
                  <Input
                    type="select"
                    value={selectedPersonaId}
                    onChange={(e) => setSelectedPersonaId(e.target.value)}
                  >
                    <option value="">Seleccione una persona...</option>
                    {personas.map((persona) => (
                      <option key={persona.idPersona} value={persona.idPersona}>
                        {getNombreCompleto(persona)} - {persona.DNI}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button color="primary" onClick={handleAsociar}>
              <FontAwesomeIcon icon={faLink} className="me-2" />
              Asociar
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

export default AsociarPersona; 