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
import { useNavigate, useParams } from 'react-router-dom';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { personaService } from '../../services/seguridad/personaService';
import { useToast } from '../../hooks/useToast';
import HeaderBlanco from '../../components/Headers/HeaderBlanco';

const ClienteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    idPersona: '',
    fechaRegistro: new Date().toISOString().split('T')[0]
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
  const [clienteOriginal, setClienteOriginal] = useState(null);
  const [warnings, setWarnings] = useState([]);

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
        const clienteData = await clienteService.obtenerClientePorId(id);
        setClienteOriginal(clienteData);
        
        setFormData({
          idPersona: clienteData.idPersona,
          fechaRegistro: clienteData.fechaRegistro ? new Date(clienteData.fechaRegistro).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        
        if (clienteData.persona) {
          setPersonaFormData({
            Pnombre: clienteData.persona.Pnombre || '',
            Snombre: clienteData.persona.Snombre || '',
            Papellido: clienteData.persona.Papellido || '',
            Sapellido: clienteData.persona.Sapellido || '',
            Direccion: clienteData.persona.Direccion || '',
            DNI: clienteData.persona.DNI || '',
            correo: clienteData.persona.correo || '',
            fechaNacimiento: clienteData.persona.fechaNacimiento ? new Date(clienteData.persona.fechaNacimiento).toISOString().split('T')[0] : '',
            genero: clienteData.persona.genero || 'M'
          });

          // Verificar problemas en datos existentes
          await verificarProblemasExistentes(clienteData.persona);
        }
      }
    } catch (error) {
      showToast('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const verificarProblemasExistentes = async (persona) => {
    const warnings = [];
    
    try {
      // Verificar si el DNI está duplicado
      const resultadoDNI = await personaService.verificarDNIExistente(persona.DNI, persona.idPersona);
      if (resultadoDNI.existe) {
        warnings.push({
          type: 'warning',
          message: `⚠️ ADVERTENCIA: El DNI ${persona.DNI} está duplicado con otra persona en el sistema. Esto puede causar problemas de identificación.`
        });
      }

      // Verificar si la persona también es empleado (ahora permitido)
      const resultadoEmpleado = await personaService.verificarPersonaEmpleado(persona.idPersona);
      if (resultadoEmpleado.esEmpleado) {
        warnings.push({
          type: 'info',
          message: `ℹ️ INFORMACIÓN: Esta persona (${persona.Pnombre} ${persona.Papellido}) también está registrada como EMPLEADO en el sistema. Esto está permitido.`
        });
      }

      setWarnings(warnings);
    } catch (error) {
      console.error('Error al verificar problemas existentes:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar campos de persona (siempre requeridos al editar)
    if (isEditing || isNewPersona) {
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

  const validateDNI = async (dni) => {
    if (!dni || dni.length !== 13) return null;
    
    try {
      const personaIdExcluir = isEditing && clienteOriginal?.persona ? clienteOriginal.persona.idPersona : null;
      const resultado = await personaService.verificarDNIExistente(dni, personaIdExcluir);
      
      if (resultado.existe) {
        return `El DNI ${dni} ya está registrado por otra persona`;
      }
      return null;
    } catch (error) {
      console.error('Error al verificar DNI:', error);
      return null;
    }
  };

  const validatePersonaUnica = async (personaId) => {
    if (!personaId) return null;
    
    try {
      // Verificar si la persona ya es cliente (excluyendo el cliente actual si estamos editando)
      const resultadoCliente = await personaService.verificarPersonaCliente(personaId);
      if (resultadoCliente.esCliente && (!isEditing || resultadoCliente.cliente.idCliente !== parseInt(id))) {
        return 'Esta persona ya es cliente en el sistema';
      }
      
      // Verificar si la persona ya es empleado (ahora permitido)
      const resultadoEmpleado = await personaService.verificarPersonaEmpleado(personaId);
      if (resultadoEmpleado.esEmpleado) {
        // Ya no es un error, solo una información
        return null;
      }
      
      return null;
    } catch (error) {
      console.error('Error al verificar persona única:', error);
      return null;
    }
  };

  const handleDNIChange = async (e) => {
    const dni = e.target.value;
    setPersonaFormData({ ...personaFormData, DNI: dni });
    
    // Limpiar error previo del DNI
    if (errors.DNI) {
      setErrors({ ...errors, DNI: null });
    }
    
    // Validar DNI en tiempo real si tiene la longitud correcta
    if (dni.length === 13) {
      const errorDNI = await validateDNI(dni);
      if (errorDNI) {
        setErrors({ ...errors, DNI: errorDNI });
      }
    }
  };

  const handlePersonaChange = async (e) => {
    const personaId = e.target.value;
    setFormData({ ...formData, idPersona: personaId });
    
    // Limpiar error previo de persona
    if (errors.idPersona) {
      setErrors({ ...errors, idPersona: null });
    }
    
    // Validar que la persona no esté duplicada
    if (personaId) {
      const errorPersona = await validatePersonaUnica(personaId);
      if (errorPersona) {
        setErrors({ ...errors, idPersona: errorPersona });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Validaciones adicionales antes de enviar
      if (isEditing || isNewPersona) {
        // Validar DNI único
        const errorDNI = await validateDNI(personaFormData.DNI);
        if (errorDNI) {
          setErrors({ ...errors, DNI: errorDNI });
          setSaving(false);
          return;
        }
      }

      if (!isNewPersona && formData.idPersona) {
        // Validar persona única
        const errorPersona = await validatePersonaUnica(formData.idPersona);
        if (errorPersona) {
          setErrors({ ...errors, idPersona: errorPersona });
          setSaving(false);
          return;
        }
      }

      let personaId = formData.idPersona;

      if (isNewPersona) {
        // Crear nueva persona
        const nuevaPersona = await personaService.crearPersona(personaFormData);
        personaId = nuevaPersona.persona.idPersona;
      } else if (isEditing && clienteOriginal?.persona) {
        // Actualizar persona existente
        await personaService.actualizarPersona(clienteOriginal.persona.idPersona, personaFormData);
        personaId = clienteOriginal.persona.idPersona;
      }

      // Crear o actualizar cliente
      const clienteData = {
        ...formData,
        idPersona: personaId
      };

      if (isEditing) {
        await clienteService.editarCliente(id, clienteData);
        
        // Verificar si se resolvieron los problemas
        if (warnings.length > 0) {
          await verificarProblemasExistentes({
            ...personaFormData,
            idPersona: personaId
          });
        }
        
        showToast('Cliente actualizado exitosamente', 'success');
      } else {
        await clienteService.crearCliente(clienteData);
        showToast('Cliente creado exitosamente', 'success');
      }

      navigate('/admin/clientes');
    } catch (error) {
      if (error.errores) {
        setErrors(error.errores);
      } else {
        showToast('Error al guardar el cliente', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/clientes');
  };

  if (loading) {
    return (
      <>
        <HeaderBlanco />
        <Container className="mt--7" fluid>  
          <Row>  
            <Col> 
              <Card className="shadow">
                <CardBody className="text-center">
                  <Spinner color="primary" />
                  <p className="mt-2">Cargando datos...</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>  
        <Row>  
          <Col> 
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Gestión
                    </h6>
                    <h5 className="h3 mb-0">
                      {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h5>
                  </Col>
                  <Col className="text-right">
                    <Button
                      color="secondary"
                      onClick={handleCancel}
                    >
                      <i className="ni ni-fat-remove mr-2"></i>
                      Cancelar
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  {/* Mensaje informativo sobre validaciones */}
                  <Row className="mb-4">
                    <Col md={12}>
                      <Alert color="info" className="mb-4">
                        <h6 className="alert-heading">
                          <i className="ni ni-bell-55 mr-2"></i>
                          Reglas de Validación
                        </h6>
                        <ul className="mb-0">
                          <li><strong>DNI único:</strong> Cada persona debe tener un DNI diferente</li>
                          <li><strong>Persona única:</strong> Una persona no puede ser empleado y cliente al mismo tiempo</li>
                          <li><strong>Campos obligatorios:</strong> Primer nombre, primer apellido y DNI son requeridos</li>
                        </ul>
                      </Alert>
                    </Col>
                  </Row>

                  {/* Mostrar advertencias sobre problemas existentes */}
                  {warnings.length > 0 && (
                    <Row className="mb-4">
                      <Col md={12}>
                        {warnings.map((warning, index) => (
                          <Alert key={index} color={warning.type} className="mb-2">
                            <div dangerouslySetInnerHTML={{ __html: warning.message }} />
                          </Alert>
                        ))}
                        <Button 
                          color="info" 
                          size="sm" 
                          onClick={() => verificarProblemasExistentes(clienteOriginal?.persona)}
                          className="mt-2"
                        >
                          <i className="ni ni-refresh mr-2"></i>
                          Verificar Integridad
                        </Button>
                      </Col>
                    </Row>
                  )}

                  {/* Solo mostrar opciones de persona si no estamos editando */}
                  {!isEditing && (
                    <Row className="mb-4">
                      <Col md={12}>
                        <FormGroup>
                          <Label>
                            <i className="ni ni-single-02 mr-2"></i>
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
                  )}

                  {/* Mostrar selector de persona existente solo si no estamos editando y no es nueva persona */}
                  {!isEditing && !isNewPersona ? (
                    <FormGroup>
                      <Label>Persona Existente</Label>
                      <Input
                        type="select"
                        value={formData.idPersona}
                        onChange={handlePersonaChange}
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
                    /* Mostrar formulario de persona si estamos editando o creando nueva persona */
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
                            onChange={handleDNIChange}
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

                  {/* Campo de fecha de registro del cliente */}
                  <FormGroup>
                    <Label>Fecha de Registro del Cliente</Label>
                    <Input
                      type="date"
                      value={formData.fechaRegistro}
                      onChange={(e) => setFormData({ ...formData, fechaRegistro: e.target.value })}
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
                        <i className="ni ni-fat-remove mr-2"></i>
                        Cancelar
                      </Button>
                      <Button 
                        color="primary" 
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
                            <i className="ni ni-settings-gear-65 mr-2"></i>
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
    </>
  );
};

export default ClienteForm;
