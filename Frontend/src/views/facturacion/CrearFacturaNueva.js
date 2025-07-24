// views/Facturas/CrearFacturaNueva.js  
import React, { useState, useEffect } from 'react';  
import {  
  Card,  
  CardHeader,  
  CardBody,  
  Form,  
  FormGroup,  
  Input,  
  Button,  
  Row,  
  Col,  
  Label,  
  Alert,  
  Table,  
  Container  
} from 'reactstrap';  
import Header from 'components/Headers/Header.js';  
import { facturaService } from '../../services/facturacion/facturaService.js';  
  
const CrearFacturaNueva = () => {  
  const [factura, setFactura] = useState({  
    idCliente: '',  
    idFormaPago: '',  
    idEmpleado: '',  
    Tipo_documento: 'Factura',  
    estadoFactura: 'activa',  
    Fecha: new Date().toISOString().slice(0, 16),  
    Total_Facturado: 0  
  });  
  
  const [detalles, setDetalles] = useState([{  
    idProducto: '',  
    cantidad: 1  
  }]);  
  
  const [descuentos, setDescuentos] = useState([]);  
  const [loading, setLoading] = useState(false);  
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });  
  
  // Calcular total automáticamente  
  useEffect(() => {  
    const subtotal = detalles.reduce((sum, detalle) => {  
      return sum + (detalle.cantidad * (detalle.precioUnitario || 0));  
    }, 0);  
      
    const totalDescuentos = descuentos.reduce((sum, desc) => sum + (desc.monto || 0), 0);  
    const subtotalConDescuento = subtotal - totalDescuentos;  
    const isv = subtotalConDescuento * 0.15;  
    const total = subtotalConDescuento + isv;  
  
    setFactura(prev => ({ ...prev, Total_Facturado: total }));  
  }, [detalles, descuentos]);  
  
  const handleFacturaChange = (e) => {  
    const { name, value } = e.target;  
    setFactura(prev => ({ ...prev, [name]: value }));  
  };  
  
  const handleDetalleChange = (index, field, value) => {  
    const nuevosDetalles = [...detalles];  
    nuevosDetalles[index][field] = value;  
    setDetalles(nuevosDetalles);  
  };  
  
  const agregarDetalle = () => {  
    setDetalles([...detalles, { idProducto: '', cantidad: 1 }]);  
  };  
  
  const eliminarDetalle = (index) => {  
    if (detalles.length > 1) {  
      setDetalles(detalles.filter((_, i) => i !== index));  
    }  
  };  
  
  const agregarDescuento = () => {  
    setDescuentos([...descuentos, { idDescuento: '', monto: 0 }]);  
  };  
  
  const handleDescuentoChange = (index, field, value) => {  
    const nuevosDescuentos = [...descuentos];  
    nuevosDescuentos[index][field] = value;  
    setDescuentos(nuevosDescuentos);  
  };  
  
  const eliminarDescuento = (index) => {  
    setDescuentos(descuentos.filter((_, i) => i !== index));  
  };  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setMensaje({ tipo: '', texto: '' });  
  
    try {  
      // Validaciones básicas  
      if (!factura.idCliente || !factura.idFormaPago || !factura.idEmpleado) {  
        throw new Error('Todos los campos obligatorios deben ser completados');  
      }  
  
      if (detalles.some(d => !d.idProducto || d.cantidad <= 0)) {  
        throw new Error('Todos los productos deben tener ID válido y cantidad mayor a 0');  
      }  
  
      const data = {   
        factura: {  
          ...factura,  
          idCliente: parseInt(factura.idCliente),  
          idFormaPago: parseInt(factura.idFormaPago),  
          idEmpleado: parseInt(factura.idEmpleado)  
        },   
        detalles: detalles.map(d => ({  
          ...d,  
          idProducto: parseInt(d.idProducto),  
          cantidad: parseInt(d.cantidad)  
        })),   
        descuentos: descuentos.map(d => ({  
          ...d,  
          idDescuento: parseInt(d.idDescuento),  
          monto: parseFloat(d.monto)  
        }))  
      };  
  
      const response = await facturaService.crearFacturaCompleta(data);  
        
      setMensaje({   
        tipo: 'success',   
        texto: `Factura creada exitosamente. ID: ${response.factura?.idFactura}`   
      });  
  
      // Limpiar formulario  
      setFactura({  
        idCliente: '',  
        idFormaPago: '',  
        idEmpleado: '',  
        Tipo_documento: 'Factura',  
        estadoFactura: 'activa',  
        Fecha: new Date().toISOString().slice(0, 16),  
        Total_Facturado: 0  
      });  
      setDetalles([{ idProducto: '', cantidad: 1 }]);  
      setDescuentos([]);  
  
    } catch (error) {  
      console.error('Error:', error);  
      setMensaje({   
        tipo: 'danger',   
        texto: error.message || 'Error al crear la factura'   
      });  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <>  
      <Header />  
      <Container className="mt--7" fluid>  
        <Row>  
          <Col>  
            <Card className="shadow">  
              <CardHeader className="border-0">  
                <Row className="align-items-center">  
                  <Col>  
                    <h3 className="mb-0">Crear Nueva Factura</h3>  
                  </Col>  
                </Row>  
              </CardHeader>  
              <CardBody>  
                {mensaje.texto && (  
                  <Alert color={mensaje.tipo} className="mb-4">  
                    {mensaje.texto}  
                  </Alert>  
                )}  
  
                <Form onSubmit={handleSubmit}>  
                  {/* Información de la Factura */}  
                  <h6 className="heading-small text-muted mb-4">  
                    Información de la Factura  
                  </h6>  
                  <div className="pl-lg-4">  
                    <Row>  
                      <Col lg="4">  
                        <FormGroup>  
                          <Label className="form-control-label" htmlFor="idCliente">  
                            Cliente *  
                          </Label>  
                          <Input  
                            className="form-control-alternative"  
                            id="idCliente"  
                            name="idCliente"  
                            type="number"  
                            value={factura.idCliente}  
                            onChange={handleFacturaChange}  
                            required  
                          />  
                        </FormGroup>  
                      </Col>  
                      <Col lg="4">  
                        <FormGroup>  
                          <Label className="form-control-label" htmlFor="idEmpleado">  
                            Empleado *  
                          </Label>  
                          <Input  
                            className="form-control-alternative"  
                            id="idEmpleado"  
                            name="idEmpleado"  
                            type="number"  
                            value={factura.idEmpleado}  
                            onChange={handleFacturaChange}  
                            required  
                          />  
                        </FormGroup>  
                      </Col>  
                      <Col lg="4">  
                        <FormGroup>  
                          <Label className="form-control-label" htmlFor="idFormaPago">  
                            Forma de Pago *  
                          </Label>  
                          <Input  
                            className="form-control-alternative"  
                            id="idFormaPago"  
                            name="idFormaPago"  
                            type="number"  
                            value={factura.idFormaPago}  
                            onChange={handleFacturaChange}  
                            required  
                          />  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                    <Row>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label className="form-control-label" htmlFor="Fecha">  
                            Fecha  
                          </Label>  
                          <Input  
                            className="form-control-alternative"  
                            id="Fecha"  
                            name="Fecha"  
                            type="datetime-local"  
                            value={factura.Fecha}  
                            onChange={handleFacturaChange}  
                          />  
                        </FormGroup>  
                      </Col>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label className="form-control-label" htmlFor="Tipo_documento">  
                            Tipo de Documento  
                          </Label>  
                          <Input  
                            className="form-control-alternative"  
                            id="Tipo_documento"  
                            name="Tipo_documento"  
                            type="text"  
                            value={factura.Tipo_documento}  
                            onChange={handleFacturaChange}  
                            maxLength="45"  
                          />  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                  </div>  
  
                  <hr className="my-4" />  
  
                  {/* Detalles de Productos */}  
                  <h6 className="heading-small text-muted mb-4">  
                    Productos  
                  </h6>  
                  <div className="pl-lg-4">  
                    <Table className="align-items-center table-flush" responsive>  
                      <thead className="thead-light">  
                        <tr>  
                          <th>Producto ID *</th>  
                          <th>Cantidad *</th>  
                          <th>Acciones</th>  
                        </tr>  
                      </thead>  
                      <tbody>  
                        {detalles.map((detalle, index) => (  
                          <tr key={index}>  
                            <td>  
                              <Input  
                                type="number"  
                                value={detalle.idProducto}  
                                onChange={(e) => handleDetalleChange(index, 'idProducto', e.target.value)}  
                                required  
                              />  
                            </td>  
                            <td>  
                              <Input  
                                type="number"  
                                min="1"  
                                value={detalle.cantidad}  
                                onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}  
                                required  
                              />  
                            </td>  
                            <td>  
                              <Button  
                                color="danger"  
                                size="sm"  
                                onClick={() => eliminarDetalle(index)}  
                                disabled={detalles.length === 1}  
                              >  
                                <i className="fas fa-trash" />  
                              </Button>  
                            </td>  
                          </tr>  
                        ))}  
                      </tbody>  
                    </Table>  
                    <Button  
                      color="info"  
                      size="sm"  
                      onClick={agregarDetalle}  
                    >  
                      <i className="fas fa-plus" /> Agregar Producto  
                    </Button>  
                  </div>  
  
                  <hr className="my-4" />  
  
                  {/* Descuentos */}  
                  <h6 className="heading-small text-muted mb-4">  
                    Descuentos (Opcional)  
                  </h6>  
                  <div className="pl-lg-4">  
                    {descuentos.length > 0 && (  
                      <Table className="align-items-center table-flush" responsive>  
                        <thead className="thead-light">  
                          <tr>  
                            <th>Descuento ID</th>  
                            <th>Monto</th>  
                            <th>Acciones</th>  
                          </tr>  
                        </thead>  
                        <tbody>  
                          {descuentos.map((descuento, index) => (  
                            <tr key={index}>  
                              <td>  
                                <Input  
                                  type="number"  
                                  value={descuento.idDescuento}  
                                  onChange={(e) => handleDescuentoChange(index, 'idDescuento', e.target.value)}  
                                />  
                              </td>  
                              <td>  
                                <Input  
                                  type="number"  
                                  step="0.01"  
                                  min="0"  
                                  value={descuento.monto}  
                                  onChange={(e) => handleDescuentoChange(index, 'monto', e.target.value)}  
                                />  
                              </td>  
                              <td>  
                                <Button  
                                  color="danger"  
                                  size="sm"  
                                  onClick={() => eliminarDescuento(index)}  
                                >  
                                  <i className="fas fa-trash" />  
                                </Button>  
                              </td>  
                            </tr>  
                          ))}  
                        </tbody>  
                      </Table>  
                    )}  
                    <Button  
                      color="info"  
                      size="sm"  
                      onClick={agregarDescuento}  
                    >  
                      <i className="fas fa-plus" /> Agregar Descuento  
                    </Button>  
                  </div>  
  
                  <hr className="my-4" />  
  
                  {/* Total */}  
                  <div className="pl-lg-4">  
                    <Row>  
                      <Col lg="6">  
                        <FormGroup>  
                          <Label className="form-control-label">  
                            Total Calculado  
                          </Label>  
                          <Input  
                            className="form-control-alternative"  
                            type="text"  
                            value={`L. ${factura.Total_Facturado.toFixed(2)}`}  
                            disabled  
                          />  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                  </div>  
  
                  {/* Botones */}  
                  <div className="pl-lg-4">  
                    <Button  
                      color="primary"  
                      type="submit"  
                      disabled={loading}  
                    >  
                      {loading ? (  
                        <>  
                          <i className="fas fa-spinner fa-spin" /> Creando...  
                        </>  
                      ) : (  
                        <>  
                          <i className="fas fa-save" /> Crear Factura  
                        </>  
                      )}  
                    </Button>  
                    <Button  
                      color="secondary"  
                      type="button"  
                      className="ml-2"  
                      href="/admin/lista-facturas"  
                    >  
                      <i className="fas fa-list" /> Ver Facturas  
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
  
export default CrearFacturaNueva;