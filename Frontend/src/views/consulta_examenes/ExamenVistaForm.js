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
  faStethoscope,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { examenVistaService } from '../../services/consulta_examenes/examenVistaService';

const ExamenVistaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    idConsulta: '',
    idReceta: '',
    Fecha_Examen: new Date().toISOString().split('T')[0],
    Observaciones: ''
  });

  useEffect(() => {
    if (isEditing) {
      cargarExamen();
    }
  }, [id, isEditing]);

  const cargarExamen = async () => {
    try {
      setLoading(true);
      const examen = await examenVistaService.obtenerExamenVistaPorId(id);
      setFormData({
        idConsulta: examen.idConsulta || '',
        idReceta: examen.idReceta || '',
        Fecha_Examen: examen.Fecha_Examen ? new Date(examen.Fecha_Examen).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        Observaciones: examen.Observaciones || ''
      });
    } catch (error) {
      console.error('Error al cargar examen:', error);
      setErrors({ general: 'Error al cargar los datos del examen' });
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

    if (!formData.idConsulta) {
      newErrors.idConsulta = 'El ID de consulta es requerido';
    }

    if (!formData.Fecha_Examen) {
      newErrors.Fecha_Examen = 'La fecha del examen es requerida';
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

      // Preparar datos para envío
      const dataToSend = { ...formData };
      
      // Convertir strings vacíos a null para campos opcionales
      if (!dataToSend.idReceta) dataToSend.idReceta = null;
      if (!dataToSend.Observaciones) dataToSend.Observaciones = null;

      if (isEditing) {
        await examenVistaService.editarExamenVista(id, dataToSend);
        setSuccessMessage('Examen actualizado exitosamente');
      } else {
        await examenVistaService.crearExamenVista(dataToSend);
        setSuccessMessage('Examen creado exitosamente');
      }

      // Redirigir después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        navigate('/admin/consulta-examenes/examenes-vista');
      }, 2000);

    } catch (error) {
      console.error('Error al guardar examen:', error);
      if (error.data && error.data.errores) {
        const backendErrors = {};
        error.data.errores.forEach(err => {
          backendErrors[err.param] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || 'Error al guardar el examen' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/consulta-examenes/examenes-vista');
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
        <Col md={8}>
          <Card className="shadow">
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <Col>
                  <h3 className="mb-0">
                    <FontAwesomeIcon icon={faStethoscope} className="mr-2" />
                    {isEditing ? 'Editar Examen de Vista' : 'Nuevo Examen de Vista'}
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
                      <Label for="idConsulta">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        ID Consulta *
                      </Label>
                      <Input
                        type="number"
                        name="idConsulta"
                        id="idConsulta"
                        value={formData.idConsulta}
                        onChange={handleChange}
                        invalid={!!errors.idConsulta}
                        placeholder="Ingrese ID de la consulta"
                      />
                      {errors.idConsulta && <span className="text-danger">{errors.idConsulta}</span>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="idReceta">ID Receta (Opcional)</Label>
                      <Input
                        type="number"
                        name="idReceta"
                        id="idReceta"
                        value={formData.idReceta}
                        onChange={handleChange}
                        invalid={!!errors.idReceta}
                        placeholder="Ingrese ID de la receta"
                      />
                      {errors.idReceta && <span className="text-danger">{errors.idReceta}</span>}
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Fecha_Examen">Fecha del Examen *</Label>
                      <Input
                        type="date"
                        name="Fecha_Examen"
                        id="Fecha_Examen"
                        value={formData.Fecha_Examen}
                        onChange={handleChange}
                        invalid={!!errors.Fecha_Examen}
                      />
                      {errors.Fecha_Examen && <span className="text-danger">{errors.Fecha_Examen}</span>}
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="Observaciones">Observaciones</Label>
                  <Input
                    type="textarea"
                    name="Observaciones"
                    id="Observaciones"
                    value={formData.Observaciones}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Ingrese las observaciones del examen..."
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

export default ExamenVistaForm;
