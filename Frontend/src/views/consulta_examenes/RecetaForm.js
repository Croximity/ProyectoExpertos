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
  faArrowLeft,
  faPrescription,
  faEye,
  faGlasses,
  faUser,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { recetaService } from '../../services/consulta_examenes/recetaService';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';

const RecetaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estados para los datos de referencia
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  
  const [formData, setFormData] = useState({
    idCliente: '',
    idEmpleado: '',
    Agudeza_Visual: '',
    EsferaIzquierdo: '',
    Esfera_Derecho: '',
    Cilindro_Izquierdo: '',
    Cilindro_Derecho: '',
    Eje_Izquierdo: '',
    Eje_Derecho: '',
    Distancia_Pupilar: '',
    Tipo_Lente: '',
    Diagnostico: '',
    Fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    cargarDatosReferencia();
  }, []);

  useEffect(() => {
    if (isEditing && clientes.length > 0 && empleados.length > 0) {
      cargarReceta();
    }
  }, [id, isEditing, clientes, empleados]);

  const cargarDatosReferencia = async () => {
    try {
      // Cargar clientes y empleados en paralelo
      const [clientesData, empleadosData] = await Promise.all([
        clienteService.obtenerClientes(),
        empleadoService.obtenerEmpleados()
      ]);
      
      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
    } catch (error) {
      console.error('Error al cargar datos de referencia:', error);
      setErrors({ general: 'Error al cargar los datos de referencia' });
    }
  };

  const cargarReceta = async () => {
    try {
      setLoading(true);
      const receta = await recetaService.obtenerRecetaPorId(id);
      
      // Buscar el cliente y empleado correspondientes
      const cliente = clientes.find(c => c.idCliente === receta.idCliente);
      const empleado = empleados.find(e => e.idEmpleado === receta.idEmpleado);
      
      setClienteSeleccionado(cliente || null);
      setEmpleadoSeleccionado(empleado || null);
      
      // Formatear la fecha correctamente
      let fechaFormateada = new Date().toISOString().split('T')[0];
      if (receta.Fecha) {
        try {
          const fecha = new Date(receta.Fecha);
          if (!isNaN(fecha.getTime())) {
            fechaFormateada = fecha.toISOString().split('T')[0];
          }
        } catch (error) {
          console.error('Error al formatear fecha:', error);
        }
      }
      
      setFormData({
        idCliente: receta.idCliente || '',
        idEmpleado: receta.idEmpleado || '',
        Agudeza_Visual: receta.Agudeza_Visual || '',
        EsferaIzquierdo: receta.EsferaIzquierdo || '',
        Esfera_Derecho: receta.Esfera_Derecho || '',
        Cilindro_Izquierdo: receta.Cilindro_Izquierdo || '',
        Cilindro_Derecho: receta.Cilindro_Derecho || '',
        Eje_Izquierdo: receta.Eje_Izquierdo || '',
        Eje_Derecho: receta.Eje_Derecho || '',
        Distancia_Pupilar: receta.Distancia_Pupilar || '',
        Tipo_Lente: receta.Tipo_Lente || '',
        Diagnostico: receta.Diagnostico || '',
        Fecha: fechaFormateada
      });
    } catch (error) {
      console.error('Error al cargar receta:', error);
      setErrors({ general: 'Error al cargar los datos de la receta' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleClienteChange = (e) => {
    const clienteId = e.target.value;
    const cliente = clientes.find(c => c.idCliente === parseInt(clienteId));
    
    setClienteSeleccionado(cliente || null);
    setFormData(prev => ({
      ...prev,
      idCliente: clienteId
    }));
    
    if (errors.idCliente) {
      setErrors(prev => ({
        ...prev,
        idCliente: ''
      }));
    }
  };

  const handleEmpleadoChange = (e) => {
    const empleadoId = e.target.value;
    const empleado = empleados.find(e => e.idEmpleado === parseInt(empleadoId));
    
    setEmpleadoSeleccionado(empleado || null);
    setFormData(prev => ({
      ...prev,
      idEmpleado: empleadoId
    }));
    
    if (errors.idEmpleado) {
      setErrors(prev => ({
        ...prev,
        idEmpleado: ''
      }));
    }
  };

  const getNombreCompletoCliente = (cliente) => {
    if (!cliente || !cliente.persona) return '';
    const persona = cliente.persona;
    return `${persona.Pnombre || ''} ${persona.Snombre || ''} ${persona.Papellido || ''} ${persona.Sapellido || ''}`.trim();
  };

  const getNombreCompletoEmpleado = (empleado) => {
    if (!empleado || !empleado.persona) return '';
    const persona = empleado.persona;
    return `${persona.Pnombre || ''} ${persona.Snombre || ''} ${persona.Papellido || ''} ${persona.Sapellido || ''}`.trim();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idCliente) {
      newErrors.idCliente = 'El cliente es requerido';
    }

    if (!formData.idEmpleado) {
      newErrors.idEmpleado = 'El empleado es requerido';
    }

    if (!formData.Fecha) {
      newErrors.Fecha = 'La fecha es requerida';
    }

    // Validaciones opcionales para números decimales
    const camposNumericos = ['EsferaIzquierdo', 'Esfera_Derecho', 'Cilindro_Izquierdo', 'Cilindro_Derecho', 'Eje_Izquierdo', 'Eje_Derecho', 'Distancia_Pupilar'];
    
    camposNumericos.forEach(campo => {
      if (formData[campo] && isNaN(parseFloat(formData[campo]))) {
        newErrors[campo] = `${campo} debe ser un número válido`;
      }
    });

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
      setErrors({});
      setSuccessMessage('');

      // Preparar datos para envío
      const dataToSend = { ...formData };
      
      // Convertir strings vacíos a null para campos opcionales
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === '') {
          dataToSend[key] = null;
        }
      });

      if (isEditing) {
        await recetaService.editarReceta(id, dataToSend);
        setSuccessMessage('Receta actualizada exitosamente');
      } else {
        await recetaService.crearReceta(dataToSend);
        setSuccessMessage('Receta creada exitosamente');
      }

      // Redirigir después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        navigate('/admin/consulta-examenes/recetas');
      }, 2000);

    } catch (error) {
      console.error('Error al guardar receta:', error);
      if (error.data && error.data.errores) {
        const backendErrors = {};
        error.data.errores.forEach(err => {
          backendErrors[err.param] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || 'Error al guardar la receta' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/consulta-examenes/recetas');
  };

  if (loading) {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow">
              <CardBody className="text-center">
                <Spinner color="primary" />
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
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <Col>
                  <h3 className="mb-0">
                    <FontAwesomeIcon icon={faPrescription} className="mr-2" />
                    {isEditing ? 'Editar Receta' : 'Nueva Receta'}
                  </h3>
                </Col>
                <Col xs="auto">
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                    Volver
                  </Button>
                </Col>
              </Row>
            </CardHeader>

            <CardBody>
              {errors.general && (
                <Alert color="danger">
                  <strong>Error:</strong> {errors.general}
                </Alert>
              )}

              {successMessage && (
                <Alert color="success">
                  <strong>Éxito:</strong> {successMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Información básica */}
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="idCliente">
                        <FontAwesomeIcon icon={faUser} className="mr-1" />
                        Cliente *
                      </Label>
                      <Input
                        type="select"
                        name="idCliente"
                        id="idCliente"
                        value={formData.idCliente}
                        onChange={handleClienteChange}
                        invalid={!!errors.idCliente}
                      >
                        <option value="">Seleccione un cliente</option>
                        {clientes.map(cliente => (
                          <option key={cliente.idCliente} value={cliente.idCliente}>
                            {getNombreCompletoCliente(cliente)} - DNI: {cliente.persona?.DNI || 'N/A'}
                          </option>
                        ))}
                      </Input>
                      {errors.idCliente && <span className="text-danger">{errors.idCliente}</span>}
                      {clienteSeleccionado && (
                        <small className="text-muted">
                          ID: {clienteSeleccionado.idCliente} | Email: {clienteSeleccionado.persona?.correo || 'N/A'}
                        </small>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="idEmpleado">
                        <FontAwesomeIcon icon={faUserTie} className="mr-1" />
                        Empleado *
                      </Label>
                      <Input
                        type="select"
                        name="idEmpleado"
                        id="idEmpleado"
                        value={formData.idEmpleado}
                        onChange={handleEmpleadoChange}
                        invalid={!!errors.idEmpleado}
                      >
                        <option value="">Seleccione un empleado</option>
                        {empleados.map(empleado => (
                          <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                            {getNombreCompletoEmpleado(empleado)} - DNI: {empleado.persona?.DNI || 'N/A'}
                          </option>
                        ))}
                      </Input>
                      {errors.idEmpleado && <span className="text-danger">{errors.idEmpleado}</span>}
                      {empleadoSeleccionado && (
                        <small className="text-muted">
                          ID: {empleadoSeleccionado.idEmpleado} | Email: {empleadoSeleccionado.persona?.correo || 'N/A'}
                        </small>
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Agudeza_Visual">Agudeza Visual</Label>
                      <Input
                        type="text"
                        name="Agudeza_Visual"
                        id="Agudeza_Visual"
                        value={formData.Agudeza_Visual}
                        onChange={handleChange}
                        maxLength={10}
                        placeholder="Ej: 20/20"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Fecha">Fecha de Creación *</Label>
                      <Input
                        type="date"
                        name="Fecha"
                        id="Fecha"
                        value={formData.Fecha}
                        onChange={handleChange}
                        invalid={!!errors.Fecha}
                      />
                      {errors.Fecha && <span className="text-danger">{errors.Fecha}</span>}
                    </FormGroup>
                  </Col>
                </Row>

                {/* Medidas del ojo izquierdo */}
                <h5 className="mt-4 mb-3">
                  <FontAwesomeIcon icon={faGlasses} className="mr-2" />
                  Ojo Izquierdo
                </h5>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="EsferaIzquierdo">Esfera</Label>
                      <Input
                        type="number"
                        step="0.25"
                        name="EsferaIzquierdo"
                        id="EsferaIzquierdo"
                        value={formData.EsferaIzquierdo}
                        onChange={handleChange}
                        invalid={!!errors.EsferaIzquierdo}
                        placeholder="0.00"
                      />
                      {errors.EsferaIzquierdo && <span className="text-danger">{errors.EsferaIzquierdo}</span>}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="Cilindro_Izquierdo">Cilindro</Label>
                      <Input
                        type="number"
                        step="0.25"
                        name="Cilindro_Izquierdo"
                        id="Cilindro_Izquierdo"
                        value={formData.Cilindro_Izquierdo}
                        onChange={handleChange}
                        invalid={!!errors.Cilindro_Izquierdo}
                        placeholder="0.00"
                      />
                      {errors.Cilindro_Izquierdo && <span className="text-danger">{errors.Cilindro_Izquierdo}</span>}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="Eje_Izquierdo">Eje</Label>
                      <Input
                        type="number"
                        name="Eje_Izquierdo"
                        id="Eje_Izquierdo"
                        value={formData.Eje_Izquierdo}
                        onChange={handleChange}
                        invalid={!!errors.Eje_Izquierdo}
                        min="0"
                        max="180"
                        placeholder="90"
                      />
                      {errors.Eje_Izquierdo && <span className="text-danger">{errors.Eje_Izquierdo}</span>}
                    </FormGroup>
                  </Col>
                </Row>

                {/* Medidas del ojo derecho */}
                <h5 className="mt-4 mb-3">Ojo Derecho</h5>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="Esfera_Derecho">Esfera</Label>
                      <Input
                        type="number"
                        step="0.25"
                        name="Esfera_Derecho"
                        id="Esfera_Derecho"
                        value={formData.Esfera_Derecho}
                        onChange={handleChange}
                        invalid={!!errors.Esfera_Derecho}
                        placeholder="0.00"
                      />
                      {errors.Esfera_Derecho && <span className="text-danger">{errors.Esfera_Derecho}</span>}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="Cilindro_Derecho">Cilindro</Label>
                      <Input
                        type="number"
                        step="0.25"
                        name="Cilindro_Derecho"
                        id="Cilindro_Derecho"
                        value={formData.Cilindro_Derecho}
                        onChange={handleChange}
                        invalid={!!errors.Cilindro_Derecho}
                        placeholder="0.00"
                      />
                      {errors.Cilindro_Derecho && <span className="text-danger">{errors.Cilindro_Derecho}</span>}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="Eje_Derecho">Eje</Label>
                      <Input
                        type="number"
                        name="Eje_Derecho"
                        id="Eje_Derecho"
                        value={formData.Eje_Derecho}
                        onChange={handleChange}
                        invalid={!!errors.Eje_Derecho}
                        min="0"
                        max="180"
                        placeholder="90"
                      />
                      {errors.Eje_Derecho && <span className="text-danger">{errors.Eje_Derecho}</span>}
                    </FormGroup>
                  </Col>
                </Row>

                {/* Información adicional */}
                <h5 className="mt-4 mb-3">Información Adicional</h5>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Distancia_Pupilar">Distancia Pupilar (mm)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        name="Distancia_Pupilar"
                        id="Distancia_Pupilar"
                        value={formData.Distancia_Pupilar}
                        onChange={handleChange}
                        invalid={!!errors.Distancia_Pupilar}
                        placeholder="62.0"
                      />
                      {errors.Distancia_Pupilar && <span className="text-danger">{errors.Distancia_Pupilar}</span>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Tipo_Lente">Tipo de Lente</Label>
                      <Input
                        type="select"
                        name="Tipo_Lente"
                        id="Tipo_Lente"
                        value={formData.Tipo_Lente}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="Monofocal">Monofocal</option>
                        <option value="Bifocal">Bifocal</option>
                        <option value="Progresivo">Progresivo</option>
                        <option value="Multifocal">Multifocal</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="Diagnostico">Diagnóstico</Label>
                  <Input
                    type="textarea"
                    name="Diagnostico"
                    id="Diagnostico"
                    value={formData.Diagnostico}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Ingrese el diagnóstico..."
                  />
                </FormGroup>

                {/* Botones de acción */}
                <Row className="mt-4">
                  <Col className="text-right">
                    <Button
                      type="button"
                      color="secondary"
                      className="mr-2"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-1" />
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      color="success"
                      disabled={saving}
                    >
                      {saving ? (
                        <Spinner size="sm" className="mr-1" />
                      ) : (
                        <FontAwesomeIcon icon={faSave} className="mr-1" />
                      )}
                      {saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
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

export default RecetaForm;
