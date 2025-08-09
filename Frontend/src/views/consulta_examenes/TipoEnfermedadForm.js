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
  faVirus
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import UserHeader from 'components/Headers/UserHeader.js';
import { tipoEnfermedadService } from '../../services/consulta_examenes/tipoEnfermedadService';

const TipoEnfermedadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    if (isEditing) {
      cargarTipoEnfermedad();
    }
  }, [id, isEditing]);

  const cargarTipoEnfermedad = async () => {
    try {
      setLoading(true);
      const tipoEnfermedad = await tipoEnfermedadService.obtenerTipoEnfermedadPorId(id);
      setFormData({
        nombre: tipoEnfermedad.nombre || tipoEnfermedad.Nombre || '',
        descripcion: tipoEnfermedad.descripcion || tipoEnfermedad.Descripcion || ''
      });
    } catch (error) {
      console.error('Error al cargar tipo de enfermedad:', error);
      setErrors({ general: 'Error al cargar los datos del tipo de enfermedad' });
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

    if (!formData.nombre || formData.nombre.trim() === '') {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.descripcion || formData.descripcion.trim() === '') {
      newErrors.descripcion = 'La descripción es requerida';
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
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim()
      };

      if (isEditing) {
        await tipoEnfermedadService.actualizarTipoEnfermedad(id, dataToSend);
        setSuccessMessage('Tipo de enfermedad actualizado exitosamente');
      } else {
        await tipoEnfermedadService.crearTipoEnfermedad(dataToSend);
        setSuccessMessage('Tipo de enfermedad creado exitosamente');
      }

      // Redirigir después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        navigate('/admin/consulta-examenes/tipos-enfermedad');
      }, 1500);

    } catch (error) {
      console.error('Error al guardar tipo de enfermedad:', error);
      setErrors({ 
        general: error.message || 'Error al guardar el tipo de enfermedad' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/consulta-examenes/tipos-enfermedad');
  };

  if (loading) {
    return (
      <>
        <UserHeader />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody className="text-center">
                  <Spinner color="primary" />
                  <p className="mt-2">Cargando tipo de enfermedad...</p>
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
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <FontAwesomeIcon icon={faVirus} className="mr-2" />
                  {isEditing ? 'Editar Tipo de Enfermedad' : 'Nuevo Tipo de Enfermedad'}
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
                        <Label for="nombre">Nombre *</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          value={formData.nombre}
                          onChange={handleChange}
                          invalid={!!errors.nombre}
                          disabled={saving}
                        />
                        {errors.nombre && (
                          <div className="invalid-feedback d-block">
                            {errors.nombre}
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

export default TipoEnfermedadForm; 