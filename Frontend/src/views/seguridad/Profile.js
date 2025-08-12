import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Badge,
  Alert
} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faIdCard, 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faVenusMars,
  faEdit,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useAuth } from '../../contexts/AuthContext';
import { personaService } from '../../services/seguridad/personaService';
import { authService } from '../../services/seguridad/authService';
import { useToast } from '../../hooks/useToast';

const Profile = () => {
  const { user } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarDatosUsuario();
  }, [user]);

  const cargarDatosUsuario = async () => {
    try {
      setLoading(true);
      const usuarioCompleto = await authService.obtenerUsuarioActual();
      
      console.log('Usuario completo recibido:', usuarioCompleto);
      
      if (usuarioCompleto && usuarioCompleto.persona) {
        // Si tiene persona asociada, cargar los datos de la persona
        setPersona(usuarioCompleto.persona);
        setFormData({
          Pnombre: usuarioCompleto.persona.Pnombre || '',
          Snombre: usuarioCompleto.persona.Snombre || '',
          Papellido: usuarioCompleto.persona.Papellido || '',
          Sapellido: usuarioCompleto.persona.Sapellido || '',
          Direccion: usuarioCompleto.persona.Direccion || '',
          DNI: usuarioCompleto.persona.DNI || '',
          correo: usuarioCompleto.persona.correo || '',
          fechaNacimiento: usuarioCompleto.persona.fechaNacimiento ? usuarioCompleto.persona.fechaNacimiento.split('T')[0] : '',
          genero: usuarioCompleto.persona.genero || 'M'
        });
      } else if (usuarioCompleto && usuarioCompleto.idPersona) {
        // Si tiene idPersona pero no los datos completos, intentar obtener la persona
        try {
          const response = await personaService.obtenerPersonaPorId(usuarioCompleto.idPersona);
          setPersona(response);
          setFormData({
            Pnombre: response.Pnombre || '',
            Snombre: response.Snombre || '',
            Papellido: response.Papellido || '',
            Sapellido: response.Sapellido || '',
            Direccion: response.Direccion || '',
            DNI: response.DNI || '',
            correo: response.correo || '',
            fechaNacimiento: response.fechaNacimiento ? response.fechaNacimiento.split('T')[0] : '',
            genero: response.genero || 'M'
          });
        } catch (personaError) {
          console.error('Error al obtener persona por ID:', personaError);
          setPersona(null);
        }
      } else {
        // Si no tiene persona asociada, mostrar mensaje
        setPersona(null);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      showError('Error al cargar los datos del usuario');
      setPersona(null);
    } finally {
      setLoading(false);
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.Pnombre || formData.Pnombre.trim().length < 2) {
      nuevosErrores.Pnombre = 'El primer nombre es obligatorio y debe tener al menos 2 caracteres';
    }
    if (!formData.Papellido || formData.Papellido.trim().length < 2) {
      nuevosErrores.Papellido = 'El primer apellido es obligatorio y debe tener al menos 2 caracteres';
    }
    if (!formData.DNI || formData.DNI.trim().length < 10) {
      nuevosErrores.DNI = 'El DNI es obligatorio y debe tener al menos 10 caracteres';
    }
    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      nuevosErrores.correo = 'El correo electrónico debe tener un formato válido';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validarFormulario()) {
        showError('Por favor, corrija los errores en el formulario');
        return;
      }

      const usuarioCompleto = await authService.obtenerUsuarioActual();
      await personaService.actualizarPersona(usuarioCompleto.idPersona, formData);
      showSuccess('Perfil actualizado exitosamente');
      setEditing(false);
      await cargarDatosUsuario(); // Recargar datos
    } catch (error) {
      if (error.response?.data?.errores) {
        setErrors(error.response.data.errores);
        showError('Hay errores en el formulario');
      } else {
        showError('Error al actualizar el perfil');
      }
    }
  };

  const cancelarEdicion = () => {
    setEditing(false);
    setErrors({});
    // Restaurar datos originales
    if (persona) {
      setFormData({
        Pnombre: persona.Pnombre || '',
        Snombre: persona.Snombre || '',
        Papellido: persona.Papellido || '',
        Sapellido: persona.Sapellido || '',
        Direccion: persona.Direccion || '',
        DNI: persona.DNI || '',
        correo: persona.correo || '',
        fechaNacimiento: persona.fechaNacimiento ? persona.fechaNacimiento.split('T')[0] : '',
        genero: persona.genero || 'M'
      });
    }
  };

  const getGeneroLabel = (genero) => {
    return genero === 'M' ? 'Masculino' : 'Femenino';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getNombreCompleto = () => {
    if (!persona) return 'Cargando...';
    return `${persona.Pnombre} ${persona.Snombre || ''} ${persona.Papellido || ''} ${persona.Sapellido || ''}`.trim();
  };

  const getEdad = () => {
    if (!persona?.fechaNacimiento) return '';
    const fechaNac = new Date(persona.fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      return edad - 1;
    }
    return edad;
  };

  if (loading) {
    return (
      <>
        <UserHeader />
        <Container className="mt--7" fluid>
          <Row>
            <Col className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Cargando...</span>
              </div>
              <p className="mt-3">Cargando perfil...</p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <UserHeader />
        <Container className="mt--7" fluid>
          <Alert color="warning">
            <h4 className="alert-heading">Usuario no autenticado</h4>
            <p>Debes iniciar sesión para ver tu perfil.</p>
          </Alert>
        </Container>
      </>
    );
  }

  if (!persona) {
    return (
      <>
        <UserHeader />
        <Container className="mt--7" fluid>
          <Alert color="warning">
            <h4 className="alert-heading">Perfil no disponible</h4>
            <p>No se encontraron datos de persona asociados a tu cuenta de usuario.</p>
            <hr />
            <p className="mb-0">
              <strong>Información del usuario:</strong><br />
              Nombre de usuario: {user?.Nombre_Usuario}<br />
              ID de usuario: {user?.idUsuario}<br />
              ID de persona: {user?.idPersona || 'No asociado'}
            </p>
            <hr />
            <p className="mb-0">
              <strong>Posibles soluciones:</strong><br />
              1. Contacta al administrador para asociar una persona a tu cuenta de usuario.<br />
              2. Verifica que tu sesión esté activa y válida.<br />
              3. Intenta cerrar sesión y volver a iniciar.
            </p>
            <hr />
            <Button 
              color="primary" 
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Recargar página
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("../../assets/img/theme/team-4-800x800.jpg")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color="info"
                    size="sm"
                    disabled
                  >
                    Conectar
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    size="sm"
                    disabled
                  >
                    Mensaje
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-6">
                <div className="text-center">
                  <h3>
                    {getNombreCompleto()}
                    {getEdad() && <span className="font-weight-light">, {getEdad()}</span>}
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {persona?.Direccion || 'Dirección no especificada'}
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Usuario del Sistema
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    DNI: {persona?.DNI || 'No especificado'}
                  </div>
                  <hr className="my-4" />
                  <p>
                    {persona?.correo && (
                      <a href={`mailto:${persona.correo}`} className="text-primary">
                        {persona.correo}
                      </a>
                    )}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Mi Perfil</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    {!editing ? (
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => setEditing(true)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                        Editar
                      </Button>
                    ) : (
                      <div>
                        <Button
                          color="success"
                          size="sm"
                          className="me-2"
                          onClick={handleSubmit}
                        >
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Guardar
                        </Button>
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={cancelarEdicion}
                        >
                          <FontAwesomeIcon icon={faTimes} className="me-2" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    Información Personal
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            Primer Nombre *
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="Pnombre"
                            value={formData.Pnombre}
                            onChange={handleInputChange}
                            placeholder="Primer nombre"
                            type="text"
                            disabled={!editing}
                            invalid={!!errors.Pnombre}
                          />
                          {errors.Pnombre && (
                            <div className="invalid-feedback d-block">
                              {errors.Pnombre}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            Segundo Nombre
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="Snombre"
                            value={formData.Snombre}
                            onChange={handleInputChange}
                            placeholder="Segundo nombre"
                            type="text"
                            disabled={!editing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            Primer Apellido *
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="Papellido"
                            value={formData.Papellido}
                            onChange={handleInputChange}
                            placeholder="Primer apellido"
                            type="text"
                            disabled={!editing}
                            invalid={!!errors.Papellido}
                          />
                          {errors.Papellido && (
                            <div className="invalid-feedback d-block">
                              {errors.Papellido}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            Segundo Apellido
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="Sapellido"
                            value={formData.Sapellido}
                            onChange={handleInputChange}
                            placeholder="Segundo apellido"
                            type="text"
                            disabled={!editing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            <FontAwesomeIcon icon={faIdCard} className="me-2" />
                            DNI *
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="DNI"
                            value={formData.DNI}
                            onChange={handleInputChange}
                            placeholder="0000-0000-00000"
                            type="text"
                            maxLength={13}
                            disabled={!editing}
                            invalid={!!errors.DNI}
                          />
                          {errors.DNI && (
                            <div className="invalid-feedback d-block">
                              {errors.DNI}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            <FontAwesomeIcon icon={faVenusMars} className="me-2" />
                            Género *
                          </label>
                          <Input
                            type="select"
                            name="genero"
                            value={formData.genero}
                            onChange={handleInputChange}
                            disabled={!editing}
                            className="form-control-alternative"
                          >
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    Información de Contacto
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label className="form-control-label">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                            Dirección
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="Direccion"
                            value={formData.Direccion}
                            onChange={handleInputChange}
                            placeholder="Dirección completa"
                            type="text"
                            disabled={!editing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                            Correo Electrónico
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="correo"
                            value={formData.correo}
                            onChange={handleInputChange}
                            placeholder="correo@ejemplo.com"
                            type="email"
                            disabled={!editing}
                            invalid={!!errors.correo}
                          />
                          {errors.correo && (
                            <div className="invalid-feedback d-block">
                              {errors.correo}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                            Fecha de Nacimiento
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleInputChange}
                            type="date"
                            disabled={!editing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    Información del Usuario
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            Nombre de Usuario
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user?.Nombre_Usuario || 'N/A'}
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            Estado
                          </label>
                          <div>
                            <Badge color="success" className="p-2">
                              {user?.estado || 'Activo'}
                            </Badge>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
