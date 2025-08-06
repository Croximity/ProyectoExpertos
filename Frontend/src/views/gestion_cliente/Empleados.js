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
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faSearch, 
  faEdit, 
  faTrash, 
  faEye,
  faUser,
  faEnvelope,
  faPhone,
  faIdCard,
  faMapMarkerAlt,
  faCalendarAlt,
  faVenusMars,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { personaService } from '../../services/seguridad/personaService';
import { useToast } from '../../hooks/useToast';
import Header from 'components/Headers/Header.js';
import Toast from 'components/Toast/Toast';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    idPersona: '',
    Fecha_Registro: new Date().toISOString().split('T')[0]
  });
  const [personaFormData, setPersonaFormData] = useState({
    Pnombre: '',
    Snombre: '',
    Papellido: '',
    Sapellido: '',
    Direccion: '',
    DNI: '',
    correo: '',
    fechaNacimiento: '',
    genero: 'M'
  });
  const [isNewPersona, setIsNewPersona] = useState(false);
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [empleadosData, personasData] = await Promise.all([
        empleadoService.obtenerEmpleados(),
        personaService.obtenerPersonas()
      ]);
      setEmpleados(empleadosData);
      setPersonas(personasData);
    } catch (error) {
      showError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filtros = {};
      if (searchTerm) {
        const terms = searchTerm.split(' ');
        if (terms.length >= 2) {
          filtros.Pnombre = terms[0];
          filtros.Papellido = terms[1];
        } else {
          filtros.Pnombre = searchTerm;
        }
      }
      const empleadosData = await empleadoService.obtenerEmpleados(filtros);
      setEmpleados(empleadosData);
    } catch (error) {
      showError('Error al buscar empleados');
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar selección de persona
    if (!isNewPersona && !formData.idPersona) {
      nuevosErrores.idPersona = 'Debe seleccionar una persona existente';
    }

    // Validar datos de nueva persona
    if (isNewPersona) {
      if (!personaFormData.Pnombre || personaFormData.Pnombre.trim().length < 2) {
        nuevosErrores.Pnombre = 'El primer nombre es obligatorio y debe tener al menos 2 caracteres';
      }
      if (!personaFormData.Papellido || personaFormData.Papellido.trim().length < 2) {
        nuevosErrores.Papellido = 'El primer apellido es obligatorio y debe tener al menos 2 caracteres';
      }
      if (!personaFormData.DNI || personaFormData.DNI.trim().length < 10) {
        nuevosErrores.DNI = 'El DNI es obligatorio y debe tener al menos 10 caracteres';
      }
      if (personaFormData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personaFormData.correo)) {
        nuevosErrores.correo = 'El correo electrónico debe tener un formato válido';
      }
    }

    // Validar fecha de registro
    if (!formData.Fecha_Registro) {
      nuevosErrores.Fecha_Registro = 'La fecha de registro es obligatoria';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    try {
      setErrors({});
      
      // Validar formulario antes de enviar
      if (!validarFormulario()) {
        showError('Por favor, corrija los errores en el formulario');
        return;
      }

      let personaId = formData.idPersona;

      if (isNewPersona) {
        // Crear nueva persona
        const nuevaPersona = await personaService.crearPersona(personaFormData);
        personaId = nuevaPersona.persona.idPersona;
        showSuccess('Persona creada exitosamente');
      }

      // Crear empleado
      const empleadoData = {
        ...formData,
        idPersona: personaId
      };

      await empleadoService.crearEmpleado(empleadoData);
      showSuccess('Empleado creado exitosamente');
      setModalOpen(false);
      resetForm();
      cargarDatos();
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response?.data?.errores) {
        setErrors(error.response.data.errores);
        showError('Hay errores en el formulario');
      } else if (error.response?.data?.mensaje) {
        showError(error.response.data.mensaje);
      } else {
        showError('Error al crear empleado');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await empleadoService.eliminarEmpleado(selectedEmpleado.idEmpleado);
      showSuccess('Empleado eliminado exitosamente');
      setModalDeleteOpen(false);
      setSelectedEmpleado(null);
      cargarDatos();
    } catch (error) {
      showError('Error al eliminar empleado');
    }
  };

  const resetForm = () => {
    setFormData({
      idPersona: '',
      Fecha_Registro: new Date().toISOString().split('T')[0]
    });
    setPersonaFormData({
      Pnombre: '',
      Snombre: '',
      Papellido: '',
      Sapellido: '',
      Direccion: '',
      DNI: '',
      correo: '',
      fechaNacimiento: '',
      genero: 'M'
    });
    setIsNewPersona(false);
    setErrors({});
  };

  const openModal = () => {
    setModalOpen(true);
    resetForm();
  };

  const openViewModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setModalViewOpen(true);
  };

  const openDeleteModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setModalDeleteOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getGeneroLabel = (genero) => {
    return genero === 'M' ? 'Masculino' : 'Femenino';
  };

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
                    <h3 className="mb-0">Gestión de Empleados</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button color="success" onClick={openModal}>
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Agregar Empleado
                    </Button>
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
                        placeholder="Buscar por nombre o apellido..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={{ color: '#525f7f' }}
                      />
                      <InputGroupAddon addonType="append">
                        <Button color="success" onClick={handleSearch}>
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
                      <th scope="col">Nombre Completo</th>
                      <th scope="col">DNI</th>
                      <th scope="col">Correo</th>
                      <th scope="col">Género</th>
                      <th scope="col">Fecha Registro</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          <div className="spinner-border text-success" role="status">
                            <span className="sr-only">Cargando...</span>
                          </div>
                        </td>
                      </tr>
                    ) : empleados.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No se encontraron empleados
                        </td>
                      </tr>
                    ) : (
                      empleados.map((empleado) => (
                        <tr key={empleado.idEmpleado}>
                          <td>{empleado.idEmpleado}</td>
                          <td>
                            {empleado.persona?.Pnombre} {empleado.persona?.Snombre} {empleado.persona?.Papellido} {empleado.persona?.Sapellido}
                          </td>
                          <td>{empleado.persona?.DNI || 'N/A'}</td>
                          <td>
                            {empleado.persona?.correo ? (
                              <a href={`mailto:${empleado.persona.correo}`}>
                                {empleado.persona.correo}
                              </a>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>
                            <Badge color={empleado.persona?.genero === 'M' ? 'primary' : 'danger'}>
                              {getGeneroLabel(empleado.persona?.genero)}
                            </Badge>
                          </td>
                          <td>{formatDate(empleado.Fecha_Registro)}</td>
                          <td>
                            <Dropdown isOpen={dropdownOpen[empleado.idEmpleado]} toggle={() => toggleDropdown(empleado.idEmpleado)}>
                              <DropdownToggle>
                                <i className="fas fa-ellipsis-v" />
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={() => openViewModal(empleado)}>Ver Detalles</DropdownItem>
                                <DropdownItem onClick={() => openDeleteModal(empleado)}>Eliminar</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
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

      {/* Modal para agregar/editar empleado */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setModalOpen(false)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Agregar Nuevo Empleado
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Seleccionar Persona
                  </Label>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="personaOption"
                        id="existingPersona"
                        checked={!isNewPersona}
                        onChange={() => setIsNewPersona(false)}
                      />
                      <label className="form-check-label" htmlFor="existingPersona">
                        Seleccionar persona existente
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="personaOption"
                        id="newPersona"
                        checked={isNewPersona}
                        onChange={() => setIsNewPersona(true)}
                      />
                      <label className="form-check-label" htmlFor="newPersona">
                        Crear nueva persona
                      </label>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            </Row>

                         {!isNewPersona ? (
               <FormGroup>
                 <Label>Persona Existente *</Label>
                 <Input
                   type="select"
                   value={formData.idPersona}
                   onChange={(e) => setFormData({ ...formData, idPersona: e.target.value })}
                   invalid={!!errors.idPersona}
                 >
                   <option value="">Seleccione una persona...</option>
                   {personas.map((persona) => (
                     <option key={persona.idPersona} value={persona.idPersona}>
                       {persona.Pnombre} {persona.Snombre} {persona.Papellido} {persona.Sapellido} - {persona.DNI}
                     </option>
                   ))}
                 </Input>
                 {errors.idPersona && (
                   <div className="invalid-feedback d-block">
                     {errors.idPersona}
                   </div>
                 )}
               </FormGroup>
             ) : (
              <Row>
                                 <Col md={6}>
                   <FormGroup>
                     <Label>Primer Nombre *</Label>
                     <Input
                       value={personaFormData.Pnombre}
                       onChange={(e) => setPersonaFormData({ ...personaFormData, Pnombre: e.target.value })}
                       placeholder="Primer nombre"
                       invalid={!!errors.Pnombre}
                     />
                     {errors.Pnombre && (
                       <div className="invalid-feedback d-block">
                         {errors.Pnombre}
                       </div>
                     )}
                   </FormGroup>
                 </Col>
                 <Col md={6}>
                   <FormGroup>
                     <Label>Segundo Nombre</Label>
                     <Input
                       value={personaFormData.Snombre}
                       onChange={(e) => setPersonaFormData({ ...personaFormData, Snombre: e.target.value })}
                       placeholder="Segundo nombre"
                     />
                   </FormGroup>
                 </Col>
                 <Col md={6}>
                   <FormGroup>
                     <Label>Primer Apellido *</Label>
                     <Input
                       value={personaFormData.Papellido}
                       onChange={(e) => setPersonaFormData({ ...personaFormData, Papellido: e.target.value })}
                       placeholder="Primer apellido"
                       invalid={!!errors.Papellido}
                     />
                     {errors.Papellido && (
                       <div className="invalid-feedback d-block">
                         {errors.Papellido}
                       </div>
                     )}
                   </FormGroup>
                 </Col>
                 <Col md={6}>
                   <FormGroup>
                     <Label>Segundo Apellido</Label>
                     <Input
                       value={personaFormData.Sapellido}
                       onChange={(e) => setPersonaFormData({ ...personaFormData, Sapellido: e.target.value })}
                       placeholder="Segundo apellido"
                     />
                   </FormGroup>
                 </Col>
                 <Col md={6}>
                   <FormGroup>
                     <Label>DNI *</Label>
                     <Input
                       value={personaFormData.DNI}
                       onChange={(e) => setPersonaFormData({ ...personaFormData, DNI: e.target.value })}
                       placeholder="0000-0000-00000"
                       maxLength={13}
                       invalid={!!errors.DNI}
                     />
                     {errors.DNI && (
                       <div className="invalid-feedback d-block">
                         {errors.DNI}
                       </div>
                     )}
                   </FormGroup>
                 </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Género *</Label>
                    <Input
                      type="select"
                      value={personaFormData.genero}
                      onChange={(e) => setPersonaFormData({ ...personaFormData, genero: e.target.value })}
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </Input>
                  </FormGroup>
                </Col>
                                 <Col md={6}>
                   <FormGroup>
                     <Label>Correo Electrónico</Label>
                     <Input
                       type="email"
                       value={personaFormData.correo}
                       onChange={(e) => setPersonaFormData({ ...personaFormData, correo: e.target.value })}
                       placeholder="correo@ejemplo.com"
                       invalid={!!errors.correo}
                     />
                     {errors.correo && (
                       <div className="invalid-feedback d-block">
                         {errors.correo}
                       </div>
                     )}
                   </FormGroup>
                 </Col>
                 <Col md={6}>
                   <FormGroup>
                     <Label>Fecha de Nacimiento</Label>
                     <Input
                       type="date"
                       value={personaFormData.fechaNacimiento}
                       onChange={(e) => setPersonaFormData({ ...personaFormData, fechaNacimiento: e.target.value })}
                     />
                   </FormGroup>
                 </Col>
                 <Col md={12}>
                   <FormGroup>
                     <Label>Dirección</Label>
                     <Input
                       value={personaFormData.Direccion}
                       onChange={(e) => setPersonaFormData({ ...personaFormData, Direccion: e.target.value })}
                       placeholder="Dirección completa"
                     />
                   </FormGroup>
                 </Col>
               </Row>
             )}

             <FormGroup>
               <Label>Fecha de Registro *</Label>
               <Input
                 type="date"
                 value={formData.Fecha_Registro}
                 onChange={(e) => setFormData({ ...formData, Fecha_Registro: e.target.value })}
                 invalid={!!errors.Fecha_Registro}
               />
               {errors.Fecha_Registro && (
                 <div className="invalid-feedback d-block">
                   {errors.Fecha_Registro}
                 </div>
               )}
             </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="success" onClick={handleSubmit}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Crear Empleado
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para ver detalles del empleado */}
      <Modal isOpen={modalViewOpen} toggle={() => setModalViewOpen(false)} size="lg">
        <ModalHeader toggle={() => setModalViewOpen(false)}>
          <FontAwesomeIcon icon={faEye} className="me-2" />
          Detalles del Empleado
        </ModalHeader>
        <ModalBody>
          {selectedEmpleado && (
            <Row>
              <Col md={6}>
                <h5>Información del Empleado</h5>
                <p><strong>ID Empleado:</strong> {selectedEmpleado.idEmpleado}</p>
                <p><strong>Fecha de Registro:</strong> {formatDate(selectedEmpleado.Fecha_Registro)}</p>
              </Col>
              <Col md={6}>
                <h5>Información Personal</h5>
                <p><strong>Nombre:</strong> {selectedEmpleado.persona?.Pnombre} {selectedEmpleado.persona?.Snombre}</p>
                <p><strong>Apellidos:</strong> {selectedEmpleado.persona?.Papellido} {selectedEmpleado.persona?.Sapellido}</p>
                <p><strong>DNI:</strong> {selectedEmpleado.persona?.DNI}</p>
                <p><strong>Género:</strong> {getGeneroLabel(selectedEmpleado.persona?.genero)}</p>
                <p><strong>Correo:</strong> {selectedEmpleado.persona?.correo || 'N/A'}</p>
                <p><strong>Fecha de Nacimiento:</strong> {formatDate(selectedEmpleado.persona?.fechaNacimiento)}</p>
                <p><strong>Dirección:</strong> {selectedEmpleado.persona?.Direccion || 'N/A'}</p>
              </Col>
            </Row>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalViewOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={modalDeleteOpen} toggle={() => setModalDeleteOpen(false)}>
        <ModalHeader toggle={() => setModalDeleteOpen(false)}>
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          Confirmar Eliminación
        </ModalHeader>
        <ModalBody>
          ¿Está seguro de que desea eliminar al empleado{' '}
          <strong>
            {selectedEmpleado?.persona?.Pnombre} {selectedEmpleado?.persona?.Papellido}
          </strong>?
          <br />
          Esta acción no se puede deshacer.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalDeleteOpen(false)}>
            Cancelar
          </Button>
          <Button color="danger" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Eliminar
          </Button>
        </ModalFooter>
      </Modal>
      </Container>
    </>
  );
};

export default Empleados;
