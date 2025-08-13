import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { consultaService } from '../../services/consulta_examenes/consultaService';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';

const ConsultaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState({
    idCliente: '',
    idEmpleado: '',
    Fecha_consulta: '',
    Motivo_consulta: '',
    Observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatosReferencia();
  }, []);

  useEffect(() => {
    if (esEdicion && clientes.length > 0 && empleados.length > 0) {
      cargarConsulta();
    }
  }, [esEdicion, id, clientes, empleados]);

  const cargarDatosReferencia = async () => {
    try {
      setLoading(true);
      const [clientesData, empleadosData] = await Promise.all([
        clienteService.obtenerClientes(),
        empleadoService.obtenerEmpleados()
      ]);
      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
    } catch (err) {
      setErrors({ general: 'Error al cargar datos de referencia' });
    } finally {
      setLoading(false);
    }
  };

  const cargarConsulta = async () => {
    try {
      setLoading(true);
      const data = await consultaService.obtenerConsultaPorId(id);
      const fecha = data.Fecha_consulta ? new Date(data.Fecha_consulta) : null;
      const fechaFormateada = fecha && !isNaN(fecha.getTime()) ? fecha.toISOString().split('T')[0] : '';
      setForm({
        idCliente: data.idCliente || '',
        idEmpleado: data.idEmpleado || '',
        Fecha_consulta: fechaFormateada,
        Motivo_consulta: data.Motivo_consulta || '',
        Observaciones: data.Observaciones || ''
      });
      const cliente = clientes.find(c => c.idCliente === data.idCliente);
      const empleado = empleados.find(e => e.idEmpleado === data.idEmpleado);
      setClienteSeleccionado(cliente || null);
      setEmpleadoSeleccionado(empleado || null);
    } catch (err) {
      setErrors({ general: 'No se pudo cargar la consulta' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.idCliente) newErrors.idCliente = 'El cliente es requerido';
    if (!form.idEmpleado) newErrors.idEmpleado = 'El empleado es requerido';
    if (!form.Fecha_consulta) newErrors.Fecha_consulta = 'La fecha es requerida';
    if (!form.Motivo_consulta || form.Motivo_consulta.trim().length < 5) newErrors.Motivo_consulta = 'El motivo debe tener al menos 5 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage('');
      const payload = {
        idCliente: Number(form.idCliente),
        idEmpleado: Number(form.idEmpleado),
        Fecha_consulta: form.Fecha_consulta,
        Motivo_consulta: form.Motivo_consulta,
        ...(form.Observaciones ? { Observaciones: form.Observaciones } : {})
      };
      if (esEdicion) {
        await consultaService.editarConsulta(id, payload);
        setSuccessMessage('Consulta actualizada exitosamente');
      } else {
        await consultaService.crearConsulta(payload);
        setSuccessMessage('Consulta creada exitosamente');
      }
      setTimeout(() => navigate('/admin/consulta-examenes/consultas'), 1200);
    } catch (err) {
      if (err?.data?.errores) {
        const backendErrors = {};
        err.data.errores.forEach(er => { backendErrors[er.param] = er.msg; });
        setErrors(backendErrors);
      } else {
        setErrors({ general: err?.data?.mensaje || err.message || 'Error al guardar' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClienteChange = (e) => {
    const clienteId = e.target.value;
    const cliente = clientes.find(c => c.idCliente === parseInt(clienteId));
    setClienteSeleccionado(cliente || null);
    setForm(prev => ({ ...prev, idCliente: clienteId }));
    if (errors.idCliente) setErrors(prev => ({ ...prev, idCliente: '' }));
  };

  const handleEmpleadoChange = (e) => {
    const empleadoId = e.target.value;
    const empleado = empleados.find(emp => emp.idEmpleado === parseInt(empleadoId));
    setEmpleadoSeleccionado(empleado || null);
    setForm(prev => ({ ...prev, idEmpleado: empleadoId }));
    if (errors.idEmpleado) setErrors(prev => ({ ...prev, idEmpleado: '' }));
  };

  const getNombreCompletoCliente = (cliente) => {
    if (!cliente || !cliente.persona) return '';
    const p = cliente.persona;
    return `${p.Pnombre || ''} ${p.Snombre || ''} ${p.Papellido || ''} ${p.Sapellido || ''}`.trim();
  };

  const getNombreCompletoEmpleado = (empleado) => {
    if (!empleado || !empleado.persona) return '';
    const p = empleado.persona;
    return `${p.Pnombre || ''} ${p.Snombre || ''} ${p.Papellido || ''} ${p.Sapellido || ''}`.trim();
  };

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">{esEdicion ? 'Editar Consulta' : 'Nueva Consulta'}</h3>
                <div>
                  <Button color="secondary" size="sm" onClick={() => navigate('/admin/consulta-examenes/consultas')}>
                    Volver
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {loading && (
                  <div className="text-center mb-3"><Spinner color="primary" /></div>
                )}
                {errors.general && (
                  <Alert color="danger">{errors.general}</Alert>
                )}
                {successMessage && (
                  <Alert color="success">{successMessage}</Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>Cliente *</Label>
                        <Input type="select" name="idCliente" id="idCliente" value={form.idCliente} onChange={handleClienteChange} invalid={!!errors.idCliente}>
                          <option value="">Seleccione un cliente</option>
                          {clientes.map(cliente => (
                            <option key={cliente.idCliente} value={cliente.idCliente}>
                              {getNombreCompletoCliente(cliente)} - DNI: {cliente.persona?.DNI || 'N/A'}
                            </option>
                          ))}
                        </Input>
                        {errors.idCliente && <span className="text-danger">{errors.idCliente}</span>}
                        {clienteSeleccionado && (
                          <small className="text-muted d-block mt-1">ID: {clienteSeleccionado.idCliente} | Email: {clienteSeleccionado.persona?.correo || 'N/A'}</small>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Empleado *</Label>
                        <Input type="select" name="idEmpleado" id="idEmpleado" value={form.idEmpleado} onChange={handleEmpleadoChange} invalid={!!errors.idEmpleado}>
                          <option value="">Seleccione un empleado</option>
                          {empleados.map(emp => (
                            <option key={emp.idEmpleado} value={emp.idEmpleado}>
                              {getNombreCompletoEmpleado(emp)} - DNI: {emp.persona?.DNI || 'N/A'}
                            </option>
                          ))}
                        </Input>
                        {errors.idEmpleado && <span className="text-danger">{errors.idEmpleado}</span>}
                        {empleadoSeleccionado && (
                          <small className="text-muted d-block mt-1">ID: {empleadoSeleccionado.idEmpleado} | Email: {empleadoSeleccionado.persona?.correo || 'N/A'}</small>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="Fecha_consulta">Fecha de Consulta</Label>
                        <Input
                          id="Fecha_consulta"
                          name="Fecha_consulta"
                          type="date"
                          value={form.Fecha_consulta}
                          onChange={handleChange}
                          invalid={!!errors.Fecha_consulta}
                        />
                        {errors.Fecha_consulta && <span className="text-danger">{errors.Fecha_consulta}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="Motivo_consulta">Motivo</Label>
                        <Input
                          id="Motivo_consulta"
                          name="Motivo_consulta"
                          type="text"
                          value={form.Motivo_consulta}
                          onChange={handleChange}
                          invalid={!!errors.Motivo_consulta}
                          minLength={5}
                          maxLength={255}
                        />
                        {errors.Motivo_consulta && <span className="text-danger">{errors.Motivo_consulta}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label for="Observaciones">Observaciones</Label>
                        <Input
                          id="Observaciones"
                          name="Observaciones"
                          type="textarea"
                          value={form.Observaciones}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end">
                    <Button color="primary" type="submit" disabled={loading}>
                      {esEdicion ? 'Guardar Cambios' : 'Crear Consulta'}
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

export default ConsultaForm;


