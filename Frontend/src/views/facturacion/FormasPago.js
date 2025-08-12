import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  InputGroup,
  InputGroupText
} from "reactstrap";
import HeaderBlanco from "components/Headers/HeaderBlanco";
import { formaPagoService } from "../../services/facturacion/formaPagoService";
import "./FormasPago.css";

const FormasPago = () => {
  const [formasPago, setFormasPago] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [formaPagoData, setFormaPagoData] = useState({
    idFormaPago: "",
    Formapago: "",
    Estado: "A"
  });

  // Cargar formas de pago al montar el componente
  useEffect(() => {
    cargarFormasPago();
  }, []);

  const cargarFormasPago = async () => {
    setLoading(true);
    try {
      const data = await formaPagoService.obtenerFormasPago();
      setFormasPago(data);
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto: 'Error al cargar las formas de pago: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormaPagoData({
      ...formaPagoData,
      [name]: value
    });
  };

  const abrirModal = (modo = 'crear', formaPago = null) => {
    setModoEdicion(modo === 'editar');
    if (modo === 'editar' && formaPago) {
      setFormaPagoData({
        idFormaPago: formaPago.idFormaPago,
        Formapago: formaPago.Formapago,
        Estado: formaPago.Estado
      });
      setIdSeleccionado(formaPago.idFormaPago);
    } else {
      setFormaPagoData({
        idFormaPago: "",
        Formapago: "",
        Estado: "A"
      });
      setIdSeleccionado(null);
    }
    setModal(true);
    setMensaje({ tipo: '', texto: '' });
  };

  const cerrarModal = () => {
    setModal(false);
    setFormaPagoData({
      idFormaPago: "",
      Formapago: "",
      Estado: "A"
    });
    setModoEdicion(false);
    setIdSeleccionado(null);
    setMensaje({ tipo: '', texto: '' });
  };

  const validarFormulario = () => {
    if (!formaPagoData.Formapago.trim()) {
      setMensaje({
        tipo: 'danger',
        texto: 'La forma de pago es obligatoria'
      });
      return false;
    }
    if (!formaPagoData.Estado) {
      setMensaje({
        tipo: 'danger',
        texto: 'El estado es obligatorio'
      });
      return false;
    }
    return true;
  };

  const guardarFormaPago = async () => {
    if (!validarFormulario()) return;

    try {
      if (modoEdicion) {
        await formaPagoService.actualizarFormaPago(idSeleccionado, formaPagoData);
        setMensaje({
          tipo: 'success',
          texto: 'Forma de pago actualizada correctamente'
        });
      } else {
        await formaPagoService.crearFormaPago(formaPagoData);
        setMensaje({
          tipo: 'success',
          texto: 'Forma de pago creada correctamente'
        });
      }
      
      cerrarModal();
      cargarFormasPago();
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto: 'Error al guardar: ' + error.message
      });
    }
  };

  const confirmarEliminacion = (formaPago) => {
    setIdSeleccionado(formaPago.idFormaPago);
    setModalEliminar(true);
  };

  const eliminarFormaPago = async () => {
    try {
      await formaPagoService.inactivarFormaPago(idSeleccionado);
      setMensaje({
        tipo: 'success',
        texto: 'Forma de pago inactivada correctamente'
      });
      setModalEliminar(false);
      setIdSeleccionado(null);
      cargarFormasPago();
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto: 'Error al inactivar: ' + error.message
      });
    }
  };

  const filtrarFormasPago = () => {
    if (!busqueda.trim()) return formasPago;
    
    return formasPago.filter(forma =>
      forma.Formapago.toLowerCase().includes(busqueda.toLowerCase()) ||
      forma.idFormaPago.toString().includes(busqueda)
    );
  };

  const obtenerEstadoBadge = (estado) => {
    return estado === 'A' ? (
      <Badge color="success">Activo</Badge>
    ) : (
      <Badge color="secondary">Inactivo</Badge>
    );
  };

  const formasFiltradas = filtrarFormasPago();

  return (
    <>
      <HeaderBlanco />
      <div className="main-content">
        <Container fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <Col>
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Gestión
                      </h6>
                      <h5 className="h3 mb-0">Formas de Pago</h5>
                    </Col>
                    <Col className="text-right">
                      <Button
                        color="primary"
                        onClick={() => abrirModal('crear')}
                      >
                        <i className="ni ni-fat-add mr-2"></i>
                        Nueva Forma de Pago
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {mensaje.texto && (
                    <Alert color={mensaje.tipo} className="mb-3">
                      {mensaje.texto}
                    </Alert>
                  )}

                  <Row className="mb-3">
                    <Col md="6">
                      <InputGroup>
                        <InputGroupText>
                          <i className="ni ni-zoom-scan-in"></i>
                        </InputGroupText>
                        <Input
                          placeholder="Buscar por nombre o ID..."
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                  </Row>

                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner color="primary" />
                      <p className="mt-2">Cargando formas de pago...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Forma de Pago</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formasFiltradas.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="text-center py-4">
                                {busqueda ? 'No se encontraron resultados' : 'No hay formas de pago registradas'}
                              </td>
                            </tr>
                          ) : (
                            formasFiltradas.map((forma) => (
                              <tr key={forma.idFormaPago}>
                                <td>{forma.idFormaPago}</td>
                                <td>{forma.Formapago}</td>
                                <td>{obtenerEstadoBadge(forma.Estado)}</td>
                                <td>
                                  <Button
                                    color="info"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => abrirModal('editar', forma)}
                                  >
                                    <i className="ni ni-ruler-pencil"></i>
                                  </Button>
                                  {forma.Estado === 'A' && (
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => confirmarEliminacion(forma)}
                                    >
                                      <i className="ni ni-fat-remove"></i>
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Modal para crear/editar */}
        <Modal isOpen={modal} toggle={cerrarModal} size="lg">
          <ModalHeader toggle={cerrarModal}>
            {modoEdicion ? 'Editar Forma de Pago' : 'Nueva Forma de Pago'}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="idFormaPago">ID *</Label>
                  <Input
                    id="idFormaPago"
                    name="idFormaPago"
                    type="number"
                    value={formaPagoData.idFormaPago}
                    onChange={handleChange}
                    disabled={modoEdicion}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="Estado">Estado *</Label>
                  <Input
                    id="Estado"
                    name="Estado"
                    type="select"
                    value={formaPagoData.Estado}
                    onChange={handleChange}
                    required
                  >
                    <option value="A">Activo</option>
                    <option value="I">Inactivo</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label for="Formapago">Forma de Pago *</Label>
                  <Input
                    id="Formapago"
                    name="Formapago"
                    type="text"
                    value={formaPagoData.Formapago}
                    onChange={handleChange}
                    placeholder="Ej: Efectivo, Tarjeta, Transferencia..."
                    maxLength={45}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button color="primary" onClick={guardarFormaPago}>
              {modoEdicion ? 'Actualizar' : 'Crear'}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal de confirmación para eliminar */}
        <Modal isOpen={modalEliminar} toggle={() => setModalEliminar(false)}>
          <ModalHeader toggle={() => setModalEliminar(false)}>
            Confirmar Inactivación
          </ModalHeader>
          <ModalBody>
            ¿Está seguro de que desea inactivar esta forma de pago?
            <br />
            <strong>Nota:</strong> Solo se inactivará, no se eliminará físicamente.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalEliminar(false)}>
              Cancelar
            </Button>
            <Button color="danger" onClick={eliminarFormaPago}>
              Inactivar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default FormasPago;
