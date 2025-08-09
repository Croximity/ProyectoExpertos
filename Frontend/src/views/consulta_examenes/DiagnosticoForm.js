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
  faClipboardCheck,
  faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { diagnosticoService } from '../../services/consulta_examenes/diagnosticoService';

const DiagnosticoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    idExamen: '',
    idTipoEnfermedad: ''
  });

  useEffect(() => {
    if (isEditing) {
      cargarDiagnostico();
    }
  }, [id, isEditing]);

  const cargarDiagnostico = async () => {
    try {
      setLoading(true);
      const diagnostico = await diagnosticoService.obtenerDiagnosticoPorId(id);
      setFormData({
        idExamen: diagnostico.idExamen || '',
        idTipoEnfermedad: diagnostico.idTipoEnfermedad || ''
      });
    } catch (error) {
      console.error('Error al cargar diagnóstico:', error);
      setErrors({ general: 'Error al cargar los datos del diagnóstico' });
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

    if (!formData.idExamen) {
      newErrors.idExamen = 'El ID del examen es requerido';
    }

    if (!formData.idTipoEnfermedad) {
      newErrors.idTipoEnfermedad = 'El tipo de enfermedad es requerido';
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

      const dataToSend = { ...formData };

      if (isEditing) {
        await diagnosticoService.editarDiagnostico(id, dataToSend);
        setSuccessMessage('Diagnóstico actualizado exitosamente');
      } else {
        await diagnosticoService.crearDiagnostico(dataToSend);
        setSuccessMessage('Diagnóstico creado exitosamente');
      }

      // Redirigir después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        navigate('/admin/consulta-examenes/diagnosticos');
      }, 2000);

    } catch (error) {
      console.error('Error al guardar diagnóstico:', error);
      if (error.data && error.data.errores) {
        const backendErrors = {};
        error.data.errores.forEach(err => {
          backendErrors[err.param] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || 'Error al guardar el diagnóstico' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/consulta-examenes/diagnosticos');
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
                    <FontAwesomeIcon icon={faClipboardCheck} className="mr-2" />
                    {isEditing ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
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
                      <Label for="idExamen">
                        <FontAwesomeIcon icon={faStethoscope} className="mr-1" />
                        ID Examen *
                      </Label>
                      <Input
                        type="number"
                        name="idExamen"
                        id="idExamen"
                        value={formData.idExamen}
                        onChange={handleChange}
                        invalid={!!errors.idExamen}
                        placeholder="Ingrese ID del examen"
                      />
                      {errors.idExamen && <span className="text-danger">{errors.idExamen}</span>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="idTipoEnfermedad">ID Tipo Enfermedad *</Label>
                      <Input
                        type="number"
                        name="idTipoEnfermedad"
                        id="idTipoEnfermedad"
                        value={formData.idTipoEnfermedad}
                        onChange={handleChange}
                        invalid={!!errors.idTipoEnfermedad}
                        placeholder="Ingrese ID del tipo de enfermedad"
                      />
                      {errors.idTipoEnfermedad && <span className="text-danger">{errors.idTipoEnfermedad}</span>}
                    </FormGroup>
                  </Col>
                </Row>

                {/* Información adicional */}
                <Alert color="info">
                  <h5>Información:</h5>
                  <p className="mb-0">
                    El diagnóstico vincula un examen específico con un tipo de enfermedad. 
                    Asegúrese de que tanto el ID del examen como el ID del tipo de enfermedad existan en el sistema.
                  </p>
                </Alert>

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

export default DiagnosticoForm;
