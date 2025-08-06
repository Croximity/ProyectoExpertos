import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faTimes, 
  faUser, 
  faEnvelope, 
  faPhone, 
  faIdCard, 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faVenusMars,
  faArrowLeft,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { personaService } from '../../services/seguridad/personaService';
import { useToast } from '../../hooks/useToast';

const EmpleadoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [errors, setErrors] = useState({});
  
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const personasData = await personaService.obtenerPersonas();
      setPersonas(personasData);

      if (id) {
        setIsEditing(true);
        const empleadoData = await empleadoService.obtenerEmpleadoPorId(id);
        setFormData({
          idPersona: empleadoData.idPersona,
          Fecha_Registro: empleadoData.Fecha_Registro ? new Date(empleadoData.Fecha_Registro).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        
        if (empleadoData.persona) {
          setPersonaFormData({
            Pnombre: empleadoData.persona.Pnombre || '',
            Snombre: empleadoData.persona.Snombre || '',
            Papellido: empleadoData.persona.Papellido || '',
            Sapellido: empleadoData.persona.Sapellido || '',
            Direccion: empleadoData.persona.Direccion || '',
            DNI: empleadoData.persona.DNI || '',
            correo: empleadoData.persona.correo || '',
            fechaNacimiento: empleadoData.persona.fechaNacimiento ? new Date(empleadoData.persona.fechaNacimiento).toISOString().split('T')[0] : '',
            genero: empleadoData.persona.genero || 'M'
          });
        }
      }
    } catch (error) {
      showToast('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isNewPersona) {
      if (!personaFormData.Pnombre.trim()) {
        newErrors.Pnombre = 'El primer nombre es obligatorio';
      }
      if (!personaFormData.Papellido.trim()) {
        newErrors.Papellido = 'El primer apellido es obligatorio';
      }
      if (!personaFormData.DNI.trim()) {
        newErrors.DNI = 'El DNI es obligatorio';
      } else if (personaFormData.DNI.length !== 13) {
        newErrors.DNI = 'El DNI debe tener exactamente 13 caracteres';
      }
      if (personaFormData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personaFormData.correo)) {
        newErrors.correo = 'El correo no tiene un formato válido';
      }
    } else {
      if (!formData.idPersona) {
        newErrors.idPersona = 'Debe seleccionar una persona';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      let personaId = formData.idPersona;

      if (isNewPersona) {
        // Crear nueva persona
        const nuevaPersona = await personaService.crearPersona(personaFormData);
        personaId = nuevaPersona.persona.idPersona;
      }

      // Crear o actualizar empleado
      const empleadoData = {
        ...formData,
        idPersona: personaId
      };

      if (isEditing) {
        await empleadoService.editarEmpleado(id, empleadoData);
        showToast('Empleado actualizado exitosamente', 'success');
      } else {
        await empleadoService.crearEmpleado(empleadoData);
        showToast('Empleado creado exitosamente', 'success');
      }

      navigate('/admin/empleados');
    } catch (error) {
      if (error.errores) {
        setErrors(error.errores);
      } else {
        showToast('Error al guardar el empleado', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/empleados');
  };

  if (loading) {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow">
              <CardBody className="text-center">
                <Spinner color="success" />
                <p className="mt-3">Cargando...</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow">
            <CardHeader className="bg-success text-white">
              <Row className="align-items-center">
                <Col>
                  <h3 className="mb-0">
                    <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                    {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
                  </h3>
                </Col>
                <Col xs="auto">
                  <Button color="light" outline onClick={handleCancel}>
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Volver
                  </Button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                {/* Selección de Persona */}
                <Row className="mb-4">
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
                    <Label>Persona Existente</Label>
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
                    {errors.idPersona && <div className="invalid-feedback d-block">{errors.idPersona}</div>}
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
                        {errors.Pnombre && <div className="invalid-feedback d-block">{errors.Pnombre}</div>}
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
                        {errors.Papellido && <div className="invalid-feedback d-block">{errors.Papellido}</div>}
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
                        {errors.DNI && <div className="invalid-feedback d-block">{errors.DNI}</div>}
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
                        {errors.correo && <div className="invalid-feedback d-block">{errors.correo}</div>}
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
                  <Label>Fecha de Registro</Label>
                  <Input
                    type="date"
                    value={formData.Fecha_Registro}
                    onChange={(e) => setFormData({ ...formData, Fecha_Registro: e.target.value })}
                  />
                </FormGroup>

                {/* Botones */}
                <Row className="mt-4">
                  <Col className="text-end">
                    <Button 
                      color="secondary" 
                      className="me-2" 
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <FontAwesomeIcon icon={faTimes} className="me-2" />
                      Cancelar
                    </Button>
                    <Button 
                      color="success" 
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          {isEditing ? 'Actualizar' : 'Guardar'}
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmpleadoForm;
