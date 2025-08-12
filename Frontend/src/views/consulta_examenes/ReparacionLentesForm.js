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
  faTools
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { reparacionLentesService } from '../../services/consulta_examenes/reparacionLentesService';

const ReparacionLentesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    idConsulta: '',
    tipoReparacion: '',
    descripcion: '',
    costo: '',
    estado: 'Pendiente',
    fechaReparacion: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isEditing) {
      cargarReparacionLente();
    }
  }, [id, isEditing]);

  const cargarReparacionLente = async () => {
    try {
      setLoading(true);
      const reparacion = await reparacionLentesService.obtenerReparacionLentePorId(id);
      setFormData({
        idConsulta: reparacion.idConsulta || reparacion.id_consulta || '',
        tipoReparacion: reparacion.tipoReparacion || reparacion.tipo_reparacion || reparacion.Tipo_Reparacion || '',
        descripcion: reparacion.descripcion || reparacion.Descripcion || '',
        costo: reparacion.costo || reparacion.Costo || '',
        estado: reparacion.estado || reparacion.Estado || 'Pendiente',
        fechaReparacion: reparacion.fechaReparacion || reparacion.fecha_reparacion || reparacion.Fecha_Reparacion || new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error al cargar reparación de lentes:', error);
      setErrors({ general: 'Error al cargar los datos de la reparación de lentes' });
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idConsulta || formData.idConsulta === '') {
      newErrors.idConsulta = 'El ID de la consulta es requerido';
    }

    if (!formData.tipoReparacion || formData.tipoReparacion.trim() === '') {
      newErrors.tipoReparacion = 'El tipo de reparación es requerido';
    }

    if (!formData.descripcion || formData.descripcion.trim() === '') {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.costo || formData.costo === '') {
      newErrors.costo = 'El costo es requerido';
    }

    if (!formData.estado) {
      newErrors.estado = 'El estado es requerido';
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
      setErrors({});
      setSuccessMessage('');

      const dataToSend = {
        idConsulta: parseInt(formData.idConsulta),
        tipoReparacion: formData.tipoReparacion.trim(),
        descripcion: formData.descripcion.trim(),
        costo: parseFloat(formData.costo),
        estado: formData.estado,
        fechaReparacion: formData.fechaReparacion
      };

      if (isEditing) {
        await reparacionLentesService.actualizarReparacionLente(id, dataToSend);
        setSuccessMessage('Reparación de lentes actualizada exitosamente');
      } else {
        await reparacionLentesService.crearReparacionLente(dataToSend);
        setSuccessMessage('Reparación de lentes creada exitosamente');
      }

      // Redirigir después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        navigate('/admin/consulta-examenes/reparacion-lentes');
      }, 1500);

    } catch (error) {
      console.error('Error al guardar reparación de lentes:', error);
      setErrors({ 
        general: error.message || 'Error al guardar la reparación de lentes' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/consulta-examenes/reparacion-lentes');
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
                  <p className="mt-2">Cargando reparación de lentes...</p>
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
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <FontAwesomeIcon icon={faTools} className="mr-2" />
                  {isEditing ? 'Editar Reparación de Lentes' : 'Nueva Reparación de Lentes'}
                </h3>
                <Button 
                  color="secondary" 
                  size="sm" 
                  onClick={handleCancel}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                  Volver
                </Button>
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
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="idConsulta">ID Consulta *</Label>
                        <Input
                          id="idConsulta"
                          name="idConsulta"
                          type="number"
                          value={formData.idConsulta}
                          onChange={handleChange}
                          invalid={!!errors.idConsulta}
                          disabled={saving}
                        />
                        {errors.idConsulta && (
                          <div className="invalid-feedback d-block">
                            {errors.idConsulta}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="tipoReparacion">Tipo de Reparación *</Label>
                        <Input
                          id="tipoReparacion"
                          name="tipoReparacion"
                          type="text"
                          value={formData.tipoReparacion}
                          onChange={handleChange}
                          invalid={!!errors.tipoReparacion}
                          disabled={saving}
                        />
                        {errors.tipoReparacion && (
                          <div className="invalid-feedback d-block">
                            {errors.tipoReparacion}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="costo">Costo *</Label>
                        <Input
                          id="costo"
                          name="costo"
                          type="number"
                          step="0.01"
                          value={formData.costo}
                          onChange={handleChange}
                          invalid={!!errors.costo}
                          disabled={saving}
                        />
                        {errors.costo && (
                          <div className="invalid-feedback d-block">
                            {errors.costo}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="estado">Estado *</Label>
                        <Input
                          id="estado"
                          name="estado"
                          type="select"
                          value={formData.estado}
                          onChange={handleChange}
                          invalid={!!errors.estado}
                          disabled={saving}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En proceso">En proceso</option>
                          <option value="Completado">Completado</option>
                          <option value="Cancelado">Cancelado</option>
                        </Input>
                        {errors.estado && (
                          <div className="invalid-feedback d-block">
                            {errors.estado}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="descripcion">Descripción *</Label>
                        <Input
                          id="descripcion"
                          name="descripcion"
                          type="textarea"
                          rows="4"
                          value={formData.descripcion}
                          onChange={handleChange}
                          invalid={!!errors.descripcion}
                          disabled={saving}
                        />
                        {errors.descripcion && (
                          <div className="invalid-feedback d-block">
                            {errors.descripcion}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col className="text-right">
                      <Button
                        color="secondary"
                        onClick={handleCancel}
                        disabled={saving}
                        className="mr-2"
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-1" />
                        Cancelar
                      </Button>
                      <Button
                        color="success"
                        type="submit"
                        disabled={saving}
                      >
                        <FontAwesomeIcon icon={faSave} className="mr-1" />
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
    </>
  );
};

export default ReparacionLentesForm; 