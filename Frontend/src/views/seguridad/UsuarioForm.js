import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert, Spinner } from 'reactstrap';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/seguridad/authService';
import { rolService } from '../../services/seguridad/rolService';
import { personaService } from '../../services/seguridad/personaService';

const UsuarioForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [roles, setRoles] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [form, setForm] = useState({ Nombre_Usuario: '', contraseña: '', idrol: '', idPersona: '' });
  const [crearPersona, setCrearPersona] = useState(false);
  const [personaForm, setPersonaForm] = useState({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [rolesData, personasData] = await Promise.all([
          rolService.obtenerRoles(),
          authService.obtenerUsuarioActual().then(() => authService.obtenerUsuarios()).catch(() => []),
        ]);
        setRoles(Array.isArray(rolesData) ? rolesData : []);
        // Para selector de personas, pedimos al backend
        const personasJson = await personaService.obtenerPersonas();
        setPersonas(Array.isArray(personasJson) ? personasJson : []);
      } catch (err) {
        setError('No se pudieron cargar roles/personas');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonaChange = (e) => {
    const { name, value } = e.target;
    setPersonaForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError(null); setSuccess(null);
      const payload = {
        Nombre_Usuario: form.Nombre_Usuario,
        contraseña: form.contraseña,
        idrol: form.idrol,
        ...(crearPersona ? { persona: personaForm } : { idPersona: form.idPersona })
      };
      if (esEdicion) {
        await authService.editarUsuarioAdmin(id, payload);
        setSuccess('Usuario actualizado');
      } else {
        await authService.crearUsuarioAdmin(payload);
        setSuccess('Usuario creado. Se enviaron credenciales por correo.');
      }
      setTimeout(() => navigate('/admin/usuarios'), 1200);
    } catch (err) {
      setError(err?.data?.mensaje || err.message || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0"><FontAwesomeIcon icon={faUserPlus} className="mr-2" /> {esEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                <Button size="sm" color="secondary" onClick={() => navigate('/admin/usuarios')}><FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Volver</Button>
              </CardHeader>
              <CardBody>
                {loading && <div className="text-center"><Spinner color="primary" /></div>}
                {error && <Alert color="danger">{error}</Alert>}
                {success && <Alert color="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>Nombre de Usuario</Label>
                      <Input name="Nombre_Usuario" value={form.Nombre_Usuario} onChange={handleChange} required />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Contraseña</Label>
                      <Input type="password" name="contraseña" value={form.contraseña} onChange={handleChange} required={!esEdicion} />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Rol</Label>
                      <Input type="select" name="idrol" value={form.idrol} onChange={handleChange} required>
                        <option value="">Seleccione un rol</option>
                        {roles.map(r => (
                          <option key={r._id} value={r._id}>{r.nombre}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup check className="mt-4">
                      <Label check>
                        <Input type="checkbox" checked={crearPersona} onChange={(e) => setCrearPersona(e.target.checked)} />{' '}
                        Crear nueva persona
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>

                {!crearPersona ? (
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label>Persona existente</Label>
                        <Input type="select" name="idPersona" value={form.idPersona} onChange={handleChange} required>
                          <option value="">Seleccione una persona</option>
                          {personas.map(p => (
                            <option key={p._id} value={p._id}>{`${p.Pnombre || ''} ${p.Papellido || ''} - DNI: ${p.DNI || 'N/A'}`}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                ) : (
                  <>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label>Primer Nombre</Label>
                          <Input name="Pnombre" value={personaForm.Pnombre} onChange={handlePersonaChange} required />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Segundo Nombre</Label>
                          <Input name="Snombre" value={personaForm.Snombre} onChange={handlePersonaChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label>Primer Apellido</Label>
                          <Input name="Papellido" value={personaForm.Papellido} onChange={handlePersonaChange} required />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Segundo Apellido</Label>
                          <Input name="Sapellido" value={personaForm.Sapellido} onChange={handlePersonaChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label>Dirección</Label>
                          <Input name="Direccion" value={personaForm.Direccion} onChange={handlePersonaChange} />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>DNI</Label>
                          <Input name="DNI" value={personaForm.DNI} onChange={handlePersonaChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label>Correo</Label>
                          <Input type="email" name="correo" value={personaForm.correo} onChange={handlePersonaChange} />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <Label>Fecha de Nacimiento</Label>
                          <Input type="date" name="fechaNacimiento" value={personaForm.fechaNacimiento} onChange={handlePersonaChange} />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <Label>Género</Label>
                          <Input type="select" name="genero" value={personaForm.genero} onChange={handlePersonaChange}>
                            <option value="M">M</option>
                            <option value="F">F</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  </>
                )}

                <div className="text-right">
                  <Button color="primary" type="submit" disabled={loading}>
                    <FontAwesomeIcon icon={faSave} className="mr-1" /> {esEdicion ? 'Guardar' : 'Crear Usuario'}
                  </Button>
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

export default UsuarioForm;


