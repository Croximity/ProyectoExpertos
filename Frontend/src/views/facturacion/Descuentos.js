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
import { descuentoService } from "../../services/facturacion/descuentoService";
import "./Descuentos.css";

const Descuentos = () => {
  const [descuentos, setDescuentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [descuentoData, setDescuentoData] = useState({
    idDescuento: "",
    Tipo: "",
    Estado: "Activo",
    Porcentaje: ""
  });

  // Cargar descuentos al montar el componente
  useEffect(() => {
    cargarDescuentos();
  }, []);

  const cargarDescuentos = async () => {
    setLoading(true);
    try {
      const data = await descuentoService.obtenerDescuentos();
      setDescuentos(data);
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto: 'Error al cargar los descuentos: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDescuentoData({
      ...descuentoData,
      [name]: value
    });
  };

  const abrirModal = (modo = 'crear', descuento = null) => {
    setModoEdicion(modo === 'editar');
    if (modo === 'editar' && descuento) {
      setDescuentoData({
        idDescuento: descuento.idDescuento,
        Tipo: descuento.Tipo,
        Estado: descuento.Estado,
        Porcentaje: descuento.Porcentaje
      });
      setIdSeleccionado(descuento.idDescuento);
    } else {
      setDescuentoData({
        idDescuento: "",
        Tipo: "",
        Estado: "Activo",
        Porcentaje: ""
      });
      setIdSeleccionado(null);
    }
    setModal(true);
    setMensaje({ tipo: '', texto: '' });
  };

  const cerrarModal = () => {
    setModal(false);
    setDescuentoData({
      idDescuento: "",
      Tipo: "",
      Estado: "Activo",
      Porcentaje: ""
    });
    setModoEdicion(false);
    setIdSeleccionado(null);
    setMensaje({ tipo: '', texto: '' });
  };

  const validarFormulario = () => {
    if (!descuentoData.Tipo.trim()) {
      setMensaje({
        tipo: 'danger',
        texto: 'El tipo de descuento es obligatorio'
      });
      return false;
    }
    if (!descuentoData.Estado) {
      setMensaje({
        tipo: 'danger',
        texto: 'El estado es obligatorio'
      });
      return false;
    }
    if (!descuentoData.Porcentaje || parseFloat(descuentoData.Porcentaje) < 0 || parseFloat(descuentoData.Porcentaje) > 100) {
      setMensaje({
        tipo: 'danger',
        texto: 'El porcentaje debe estar entre 0 y 100'
      });
      return false;
    }
    return true;
  };

  const guardarDescuento = async () => {
    if (!validarFormulario()) return;

    try {
      const datosParaEnviar = {
        ...descuentoData,
        Porcentaje: parseFloat(descuentoData.Porcentaje)
      };

      if (modoEdicion) {
        await descuentoService.actualizarDescuento(idSeleccionado, datosParaEnviar);
        setMensaje({
          tipo: 'success',
          texto: 'Descuento actualizado correctamente'
        });
      } else {
        await descuentoService.crearDescuento(datosParaEnviar);
        setMensaje({
          tipo: 'success',
          texto: 'Descuento creado correctamente'
        });
      }
      
      cerrarModal();
      cargarDescuentos();
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto: 'Error al guardar: ' + error.message
      });
    }
  };

  const confirmarEliminacion = (descuento) => {
    setIdSeleccionado(descuento.idDescuento);
    setModalEliminar(true);
  };

  const eliminarDescuento = async () => {
    try {
      await descuentoService.eliminarDescuento(idSeleccionado);
      setMensaje({
        tipo: 'success',
        texto: 'Descuento eliminado correctamente'
      });
      setModalEliminar(false);
      setIdSeleccionado(null);
      cargarDescuentos();
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto: 'Error al eliminar: ' + error.message
      });
    }
  };

  const filtrarDescuentos = () => {
    if (!busqueda.trim()) return descuentos;
    
    return descuentos.filter(descuento =>
      descuento.Tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
      descuento.idDescuento.toString().includes(busqueda) ||
      descuento.Porcentaje.toString().includes(busqueda)
    );
  };

  const obtenerEstadoBadge = (estado) => {
    return estado === 'Activo' ? (
      <Badge color="success">Activo</Badge>
    ) : (
      <Badge color="secondary">Inactivo</Badge>
    );
  };

  const descuentosFiltrados = filtrarDescuentos();

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
                      <h5 className="h3 mb-0">Descuentos</h5>
                    </Col>
                    <Col className="text-right">
                      <Button
                        color="primary"
                        onClick={() => abrirModal('crear')}
                      >
                        <i className="ni ni-fat-add mr-2"></i>
                        Nuevo Descuento
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
                          placeholder="Buscar por tipo, ID o porcentaje..."
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                  </Row>

                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner color="primary" />
                      <p className="mt-2">Cargando descuentos...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Porcentaje</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {descuentosFiltrados.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-4">
                                {busqueda ? 'No se encontraron resultados' : 'No hay descuentos registrados'}
                              </td>
                            </tr>
                          ) : (
                            descuentosFiltrados.map((descuento) => (
                              <tr key={descuento.idDescuento}>
                                <td>{descuento.idDescuento}</td>
                                <td>{descuento.Tipo}</td>
                                <td>
                                  <Badge color="info">
                                    {descuento.Porcentaje}%
                                  </Badge>
                                </td>
                                <td>{obtenerEstadoBadge(descuento.Estado)}</td>
                                <td>
                                  <Button
                                    color="info"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => abrirModal('editar', descuento)}
                                  >
                                    <i className="ni ni-ruler-pencil"></i>
                                  </Button>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => confirmarEliminacion(descuento)}
                                  >
                                    <i className="ni ni-fat-remove"></i>
                                  </Button>
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
            {modoEdicion ? 'Editar Descuento' : 'Nuevo Descuento'}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="idDescuento">ID *</Label>
                  <Input
                    id="idDescuento"
                    name="idDescuento"
                    type="number"
                    value={descuentoData.idDescuento}
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
                    value={descuentoData.Estado}
                    onChange={handleChange}
                    required
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="Tipo">Tipo de Descuento *</Label>
                  <Input
                    id="Tipo"
                    name="Tipo"
                    type="text"
                    value={descuentoData.Tipo}
                    onChange={handleChange}
                    placeholder="Ej: Tercera Edad, Estudiante..."
                    maxLength={45}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="Porcentaje">Porcentaje (%) *</Label>
                  <Input
                    id="Porcentaje"
                    name="Porcentaje"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={descuentoData.Porcentaje}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                  <small className="form-text text-muted">
                    Valor entre 0 y 100
                  </small>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button color="primary" onClick={guardarDescuento}>
              {modoEdicion ? 'Actualizar' : 'Crear'}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal de confirmación para eliminar */}
        <Modal isOpen={modalEliminar} toggle={() => setModalEliminar(false)}>
          <ModalHeader toggle={() => setModalEliminar(false)}>
            Confirmar Eliminación
          </ModalHeader>
          <ModalBody>
            ¿Está seguro de que desea eliminar este descuento?
            <br />
            <strong>Advertencia:</strong> Esta acción no se puede deshacer.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalEliminar(false)}>
              Cancelar
            </Button>
            <Button color="danger" onClick={eliminarDescuento}>
              Eliminar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default Descuentos;
