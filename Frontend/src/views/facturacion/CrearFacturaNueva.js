// views/Facturas/CrearFacturaNueva.js  

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import { facturaService } from '../../services/facturacion/facturaService.js';  
import { caiService } from '../../services/facturacion/caiService.js';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { empleadoService } from '../../services/gestion_cliente/empleadoService';
import { authService } from '../../services/seguridad/authService';
import { productoService } from '../../services/productos/productoService';


// Servicios que necesitas crear siguiendo el mismo patrón
import axiosInstance from '../../utils/axiosConfig';


const formaPagoService = {
  obtenerFormasPago: async () => {
    const response = await axiosInstance.get('/formas-pago');
    return response.data;
  }
};

const descuentoService = {
  obtenerDescuentos: async () => {
    const response = await axiosInstance.get('/descuentos');
    return response.data;
  }
};
  
const CrearFacturaNueva = () => {  
  const [factura, setFactura] = useState({  
    idCliente: '',  
    idFormaPago: '1',
    idEmpleado: '',  
    Tipo_documento: 'Factura',  
    estadoFactura: 'activa',  
    Fecha: new Date().toISOString().slice(0, 16),  
    Total_Facturado: 0  
  });  
  
  const [detalles, setDetalles] = useState([
    {
    idProducto: '',  
      cantidad: 1,
      precioUnitario: 0,
      total: 0,
      nombreProducto: '',
      descripcionProducto: '',
      isManualEntry: false
    }
  ]);
  
  const [descuentos, setDescuentos] = useState([{ idDescuento: '', monto: 0 }]);
  const [loading, setLoading] = useState(false);  
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });  
  
  // Estados para datos de referencia
  const [caiActivo, setCaiActivo] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [productos, setProductos] = useState([]);
  const [descuentosDisponibles, setDescuentosDisponibles] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Estado para cálculos automáticos
  const [calculoAutomatico, setCalculoAutomatico] = useState({
    subtotal: 0,
    descuentos: 0,
    subtotalConDescuento: 0,
    isv: 0,
    total: 0
  });

  // Cargar CAI activo al montar el componente
  const cargarCAIActivo = async () => {
    try {
      const data = await caiService.obtenerCAIActivo();
      if (data.cai) {
        setCaiActivo(data.cai);
      }
    } catch (error) {
      console.error('Error cargando CAI:', error);
      setCaiActivo(null);
    }
  };

  
  // Función para mostrar el siguiente número de factura (solo informativo)
  const cargarSiguienteNumeroFactura = async () => {  
    try {  
      const data = await facturaService.obtenerSiguienteNumeroFactura();  
      // Solo para mostrar información al usuario, no se usa para crear la factura
      console.log('Siguiente número de factura disponible:', data.siguienteNumero);
    } catch (error) {  
      console.error('Error al cargar siguiente número de factura:', error);  
    }  
  };

  // Función para calcular totales automáticamente
  const calcularTotales = useCallback((detallesActuales, descuentosActuales) => {
    // Calcular subtotal
    const subtotal = detallesActuales.reduce((sum, detalle) => {
      return sum + (parseFloat(detalle.total) || 0);
    }, 0);
    
    // Calcular total de descuentos
    const totalDescuentos = descuentosActuales.reduce((sum, descuento) => {
      return sum + (parseFloat(descuento.monto) || 0);
    }, 0);  
      
    // Subtotal con descuentos
    const subtotalConDescuento = subtotal - totalDescuentos;  
    
    // Calcular ISV (15%)
    const isv = subtotalConDescuento * 0.15;  
    
    // Total final
    const total = subtotalConDescuento + isv;  
  
    setCalculoAutomatico({
      subtotal,
      descuentos: totalDescuentos,
      subtotalConDescuento,
      isv,
      total
    });
    
    // Actualizar el total de la factura
    setFactura(prev => ({
      ...prev,
      Total_Facturado: total
    }));
  }, []);

  // Función para manejar cambios en detalles
  const handleDetalleChange = useCallback((index, field, value) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index] = { ...nuevosDetalles[index], [field]: value };
    
    // Calcular precio unitario y total automáticamente
    if (field === 'idProducto' && value) {
      const producto = productos.find(p => p.idProducto === parseInt(value));
      if (producto) {
        // Usar el campo correcto del precio según el modelo
        const precio = producto.precioVenta || producto.Precio || producto.precio || 0;
        nuevosDetalles[index].precioUnitario = precio;
        const cantidad = parseFloat(nuevosDetalles[index].cantidad) || 1;
        nuevosDetalles[index].total = cantidad * precio;
        
        // Agregar información adicional del producto
        nuevosDetalles[index].nombreProducto = producto.Nombre || producto.nombre;
        nuevosDetalles[index].descripcionProducto = producto.Descripcion || producto.descripcion;
        nuevosDetalles[index].isManualEntry = false;
      }
    } else if (field === 'cantidad') {
      const precio = parseFloat(nuevosDetalles[index].precioUnitario) || 0;
      let cantidad = parseFloat(value);
      
      // Validar que la cantidad sea un número válido y mayor a 0
      if (isNaN(cantidad) || cantidad <= 0) {
        cantidad = 1; // Valor por defecto si es inválido
      }
      
      nuevosDetalles[index].total = cantidad * precio;
      
      // Debug: verificar el valor de cantidad
      console.log(`Campo cantidad cambiado - valor original: ${value}, parseado: ${cantidad}, tipo: ${typeof value}`);
    } else if (field === 'nombreProducto') {
      // Para entradas manuales, calcular total basado en precio y cantidad
      const precio = parseFloat(nuevosDetalles[index].precioUnitario) || 0;
      const cantidad = parseFloat(nuevosDetalles[index].cantidad) || 1;
      nuevosDetalles[index].total = cantidad * precio;
      nuevosDetalles[index].isManualEntry = true;
      nuevosDetalles[index].idProducto = ''; // Limpiar producto seleccionado
    } else if (field === 'precioUnitario') {
      // Para entradas manuales, calcular total basado en precio y cantidad
      const precio = parseFloat(value) || 0;
      const cantidad = parseFloat(nuevosDetalles[index].cantidad) || 1;
      nuevosDetalles[index].total = cantidad * precio;
      if (nuevosDetalles[index].nombreProducto) {
        nuevosDetalles[index].isManualEntry = true;
        nuevosDetalles[index].idProducto = ''; // Limpiar producto seleccionado
      }
    }
    
    setDetalles(nuevosDetalles);
    
    // Calcular totales automáticamente
    calcularTotales(nuevosDetalles, descuentos);
  }, [detalles, productos, descuentos, calcularTotales]);

  // Función para alternar entre entrada manual y selección de producto
  const toggleManualEntry = useCallback((index) => {
    const nuevosDetalles = [...detalles];  
    const detalle = nuevosDetalles[index];
    
    if (detalle.isManualEntry) {
      // Cambiar a selección de producto
      detalle.isManualEntry = false;
      detalle.nombreProducto = '';
      detalle.descripcionProducto = '';
      detalle.precioUnitario = 0;
      detalle.total = 0;
    } else {
      // Cambiar a entrada manual
      detalle.isManualEntry = true;
      detalle.idProducto = '';
      detalle.precioUnitario = 0;
      detalle.total = 0;
    }
    
    setDetalles(nuevosDetalles);  
    calcularTotales(nuevosDetalles, descuentos);
  }, [detalles, descuentos, calcularTotales]);

  // Función para manejar cambios en descuentos
  const handleDescuentoChange = useCallback((index, field, value) => {
    const nuevosDescuentos = [...descuentos];
    nuevosDescuentos[index] = { ...nuevosDescuentos[index], [field]: value };
    
    // Si se seleccionó un descuento, calcular el monto automáticamente
    if (field === 'idDescuento' && value) {
      const descuentoSeleccionado = descuentosDisponibles.find(d => d.idDescuento === parseInt(value));
      if (descuentoSeleccionado) {
        // Calcular subtotal actual de los detalles
        const subtotal = detalles.reduce((sum, detalle) => {
          return sum + (parseFloat(detalle.total) || 0);
        }, 0);
        const montoDescuento = (subtotal * descuentoSeleccionado.Porcentaje) / 100;
        nuevosDescuentos[index].monto = montoDescuento;
      }
    }
    
    setDescuentos(nuevosDescuentos);
    
    // Recalcular totales después de cambiar descuentos
    calcularTotales(detalles, nuevosDescuentos);
  }, [descuentos, descuentosDisponibles, detalles, calcularTotales]);

  // Función para obtener el DNI del cliente seleccionado
  const obtenerDNICliente = useCallback(() => {
    console.log('obtenerDNICliente llamado, clienteSeleccionado:', clienteSeleccionado);
    const dni = clienteSeleccionado?.persona?.DNI || '';
    console.log('DNI obtenido:', dni);
    return dni;
  }, [clienteSeleccionado]);

  // Función para manejar cambios en la factura
  const handleFacturaChange = useCallback((field, value) => {
    console.log('handleFacturaChange llamado con:', field, value);
    setFactura(prev => ({ ...prev, [field]: value }));
    
    // Si se seleccionó un cliente, actualizar el estado del cliente seleccionado
    if (field === 'idCliente') {
      console.log('Campo idCliente detectado, valor:', value);
      if (value) {
        const cliente = clientes.find(c => c.idCliente === parseInt(value));
        console.log('Cliente encontrado:', cliente);
        setClienteSeleccionado(cliente || null);
      } else {
        console.log('Limpiando cliente seleccionado');
        setClienteSeleccionado(null);
      }
    }
  }, [clientes]);
  
  const agregarDetalle = () => {  
    // Obtener la cantidad del último detalle si existe, o usar 1 como valor por defecto
    const ultimaCantidad = detalles.length > 0 ? detalles[detalles.length - 1].cantidad : 1;
    
    const nuevosDetalles = [...detalles, { 
      idProducto: '', 
      cantidad: ultimaCantidad, // Preservar la cantidad del detalle anterior
      precioUnitario: 0, 
      total: 0,
      nombreProducto: '',
      descripcionProducto: '',
      isManualEntry: false
    }];
    setDetalles(nuevosDetalles);
    // Recalcular totales después de agregar
    calcularTotales(nuevosDetalles, descuentos);
  };  
  
  const eliminarDetalle = (index) => {  
    if (detalles.length > 1) {  
      const nuevosDetalles = detalles.filter((_, i) => i !== index);
      setDetalles(nuevosDetalles);
      // Recalcular totales después de eliminar
      calcularTotales(nuevosDetalles, descuentos);
    }  
  };  
  
  const agregarDescuento = () => {  
    const nuevosDescuentos = [...descuentos, { idDescuento: '', monto: 0 }];
    setDescuentos(nuevosDescuentos);  
    // Recalcular totales después de agregar
    calcularTotales(detalles, nuevosDescuentos);
  };  
  
  const eliminarDescuento = (index) => {  
    if (descuentos.length > 1) {
      const nuevosDescuentos = descuentos.filter((_, i) => i !== index);
      setDescuentos(nuevosDescuentos);
      // Recalcular totales después de eliminar
      calcularTotales(detalles, nuevosDescuentos);
    }
  };

  // Cargar datos de referencia al montar el componente
  const cargarClientes = async () => {
    try {
      const clientesRes = await clienteService.obtenerClientes();
      setClientes(Array.isArray(clientesRes) ? clientesRes : clientesRes.data || []);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      setClientes([]);
    }
  };

  const cargarEmpleados = async () => {
    try {
      // Usar el método correcto para obtener todos los empleados
      const empleadosRes = await empleadoService.obtenerEmpleados();
      setEmpleados(Array.isArray(empleadosRes) ? empleadosRes : empleadosRes.data || []);
    } catch (error) {
      console.error('Error cargando empleados:', error);
      setEmpleados([]);
    }
  };

  const cargarFormasPago = async () => {
    try {
      const formasPagoRes = await formaPagoService.obtenerFormasPago();
      setFormasPago(Array.isArray(formasPagoRes) ? formasPagoRes : formasPagoRes.data || []);
    } catch (error) {
      console.error('Error cargando formas de pago:', error);
      setFormasPago([]);
    }
  };

  const cargarProductos = async () => {
    try {
      const productosRes = await productoService.obtenerProductos();
      setProductos(Array.isArray(productosRes) ? productosRes : productosRes.data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setProductos([]);
    }
  };

  const cargarDescuentos = async () => {
    try {
      const descuentosRes = await descuentoService.obtenerDescuentos();
      setDescuentosDisponibles(Array.isArray(descuentosRes) ? descuentosRes : descuentosRes.data || []);
    } catch (error) {
      console.error('Error cargando descuentos:', error);
      setDescuentosDisponibles([]);
    }
  };

  const cargarTodosLosDatos = async () => {
    try {
      setLoadingData(true);
      
      // Cargar datos en paralelo, pero el número de factura se cargará después del CAI
      await Promise.all([
        cargarClientes(),
        cargarEmpleados(),
        cargarFormasPago(),
        cargarProductos(),
        cargarDescuentos(),
        cargarCAIActivo(),
        cargarSiguienteNumeroFactura()
      ]);

      // Preseleccionar empleado que inició sesión (si existe)
      const usuarioActual = authService.getCurrentUser();
      if (usuarioActual?.idEmpleado) {
        setFactura(prev => ({ ...prev, idEmpleado: String(usuarioActual.idEmpleado) }));
      }

      setLoadingData(false);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      setLoadingData(false);
    }
  };

  // Efecto para calcular totales cuando cambien detalles o descuentos
  useEffect(() => {
    if (detalles.length > 0 && descuentos.length >= 0) {
      // Solo calcular si hay cambios reales
      const subtotal = detalles.reduce((sum, detalle) => {
        return sum + (parseFloat(detalle.total) || 0);
      }, 0);
      
      if (subtotal !== calculoAutomatico.subtotal) {
        calcularTotales(detalles, descuentos);
      }
    }
  }, [detalles, descuentos, calcularTotales]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  // Efecto para cargar siguiente número de factura cuando se cargue el CAI (solo informativo)
  useEffect(() => {
    if (caiActivo) {
      console.log('CAI activo cargado, obteniendo siguiente número de factura...');
      cargarSiguienteNumeroFactura();
    }
  }, [caiActivo]);

  // Calcular total automáticamente
  useEffect(() => {
    setFactura(prev => ({ ...prev, Total_Facturado: calculoAutomatico.total }));
  }, [calculoAutomatico.total]);

  // Actualizar Total_Facturado cuando cambie calculoAutomatico.total
  useEffect(() => {
    if (calculoAutomatico.total > 0 && factura.Total_Facturado !== calculoAutomatico.total) {
      setFactura(prev => ({ ...prev, Total_Facturado: calculoAutomatico.total }));
    }
  }, [calculoAutomatico.total, factura.Total_Facturado]);

  // Monitorear cambios en clienteSeleccionado para depuración
  useEffect(() => {
    console.log('clienteSeleccionado cambió:', clienteSeleccionado);
  }, [clienteSeleccionado]);

  // Inicializar descuentos cuando se carguen los descuentos disponibles
  useEffect(() => {
    if (descuentosDisponibles.length > 0 && descuentos.length === 0) {
      setDescuentos([{ idDescuento: '', monto: 0 }]);
    }
  }, []);
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setMensaje({ tipo: '', texto: '' });  
  
    try {  
      // Validaciones básicas  
      if (!factura.idCliente || !factura.idFormaPago || !factura.idEmpleado) {  
        throw new Error('Todos los campos obligatorios deben ser completados');  
      }  
  
      // Validar que todos los detalles tengan la información necesaria
      if (detalles.some(d => {
        // Para entrada manual, solo necesitamos nombre, cantidad y precio (descripción es opcional)
        if (d.isManualEntry) {
          return !d.nombreProducto || d.cantidad <= 0 || d.precioUnitario <= 0;
        }
        // Para productos seleccionados, necesitamos idProducto y cantidad
        return !d.idProducto || d.cantidad <= 0;
      })) {
        throw new Error('Todos los detalles deben tener la información requerida. Para entrada manual: nombre, cantidad y precio (descripción es opcional). Para productos: ID válido y cantidad mayor a 0');
      }

      // Validar que el total sea mayor a 0
      if (calculoAutomatico.total <= 0) {
        throw new Error('El total de la factura debe ser mayor a 0');
      }
      // Debug: verificar los valores antes de enviar
      console.log('Detalles antes de mapear:', detalles);
  
      const data = {   
        factura: {  
          ...factura,  
          // No enviar idFactura, se generará automáticamente en el backend
          idCliente: parseInt(factura.idCliente),  
          idFormaPago: parseInt(factura.idFormaPago),  
          idEmpleado: parseInt(factura.idEmpleado),
        },   
        detalles: detalles.map(d => {
          const detalle = {
          ...d,  
            Cantidad: parseInt(d.cantidad) || 1,
            precioUnitario: parseFloat(d.precioUnitario) || 0,
            total: parseFloat(d.total) || 0,
            nombreProducto: d.nombreProducto || '',
            descripcionProducto: d.descripcionProducto || ''
          };
          
          // Solo incluir idProducto si no es entrada manual
          if (!d.isManualEntry && d.idProducto) {
            detalle.idProducto = parseInt(d.idProducto);
          }
          
          // Debug: verificar cada detalle procesado
          console.log(`Detalle procesado - cantidad original: ${d.cantidad}, parseada: ${detalle.cantidad}, tipo original: ${typeof d.cantidad}`);
          
          return detalle;
        }),   
        descuentos: descuentos.map(d => ({  
          ...d,  
          idDescuento: parseInt(d.idDescuento),  
          Monto: parseFloat(d.monto)  
        }))  
      };  
      
      // Debug: verificar los datos finales
      console.log('Datos finales a enviar:', data);  
  
      const response = await facturaService.crearFacturaCompleta(data);  
        
      setMensaje({   
        tipo: 'success',   
        texto: `Factura creada exitosamente. ID: ${response.factura?.idFactura}`   
      });  
  
      // Limpiar formulario  
      setFactura({  
        idCliente: '',  
        DNI: '',
        idFormaPago: '1',
        idEmpleado: '',  
        Tipo_documento: 'Factura',  
        estadoFactura: 'activa',  
        Fecha: new Date().toISOString().slice(0, 16),  
        Total_Facturado: 0  
      });  
      setDetalles([{ 
        idProducto: '', 
        cantidad: 1, 
        precioUnitario: 0, 
        total: 0,
        nombreProducto: '',
        descripcionProducto: '',
        isManualEntry: false
      }]);  
      setDescuentos([]);  
      setCalculoAutomatico({
        subtotal: 0,
        descuentos: 0,
        subtotalConDescuento: 0,
        isv: 0,
        total: 0
      });
  
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

  // Efecto para calcular totales cuando cambien detalles o descuentos
  useEffect(() => {
    if (detalles.length > 0 && descuentos.length >= 0) {
      // Solo calcular si hay cambios reales
      const subtotal = detalles.reduce((sum, detalle) => {
        return sum + (parseFloat(detalle.total) || 0);
      }, 0);
      
      if (subtotal !== calculoAutomatico.subtotal) {
        calcularTotales(detalles, descuentos);
      }
    }
  }, [detalles, descuentos, calcularTotales]);



  if (loadingData) {
    return (
      <>
        <HeaderBlanco />
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody className="text-center">
                  <i className="fas fa-spinner fa-spin fa-2x mb-3" />
                  <p>Cargando datos...</p>
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
                  {/* Información Básica de la Factura */}
                  <h6 className="heading-small text-muted mb-4">  
                    Información General de la Factura
                  </h6>  
                  <div className="pl-lg-4">  
                    <Row>  
                      <Col lg="4">  
                      <FormGroup>      
                        <Label className="form-control-label" htmlFor="idFactura">      
                          No. Factura  
                        </Label>      
                        <Input      
                          className="form-control-alternative"      
                          id="idFactura"      
                          name="idFactura"      
                          type="text"      
                          value="Se generará automáticamente"      
                          disabled      
                        />      
                        <small className="text-muted">      
                          Número generado automáticamente al crear la factura      
                        </small>      
                      </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <Label className="form-control-label" htmlFor="cai">
                            CAI *
                          </Label>  
                          <Input  
                            className="form-control-alternative"  
                            id="cai"
                            name="cai"
                            type="text"
                            value={caiActivo?.codigoCAI || 'Cargando CAI...'}
                            disabled
                            required  
                          />  
                          {caiActivo && (
                            <small className="text-muted">
                              Válido hasta: {new Date(caiActivo.fechaVencimiento).toLocaleDateString('es-HN')}
                            </small>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <Label className="form-control-label" htmlFor="idFormaPago">
                            Forma de Pago *
                          </Label>
                          <Input
                            className="form-control-alternative"
                            id="idFormaPago"
                            name="idFormaPago"
                            type="select"
                            value={factura.idFormaPago}
                            onChange={(e) => handleFacturaChange('idFormaPago', e.target.value)}
                            required
                          >
                            <option value="">Seleccionar forma de pago...</option>
                            {formasPago.map(forma => (
                              <option key={forma.idFormaPago} value={forma.idFormaPago}>
                                 {forma.Formapago}
                              </option>
                            ))}
                       </Input>
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
                            type="select"
                            value={factura.idEmpleado}  
                            onChange={(e) => handleFacturaChange('idEmpleado', e.target.value)}
                            required  
                              >
                            <option value="">Seleccionar empleado...</option>
                            {empleados.map(empleado => (
                              <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                {empleado.persona?.Pnombre} {empleado.persona?.Snombre} {empleado.persona?.Papellido}  {empleado.persona?.Sapellido}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>  
                      </Col>  
                      <Col lg="4">  
                        <FormGroup>  
                          <Label className="form-control-label" htmlFor="Fecha">  
                            Fecha Actual
                          </Label>  
                          <Input  
                            className="form-control-alternative"  
                            id="Fecha"  
                            name="Fecha"  
                            type="datetime-local"  
                            value={factura.Fecha}  
                            onChange={(e) => handleFacturaChange('Fecha', e.target.value)}
                          />  
                        </FormGroup>  
                      </Col>  
                    </Row>
                  </div>

                  <hr className="my-4" />

                  {/* Información del Cliente */}
                  <h6 className="heading-small text-muted mb-4">
                    Información del Cliente
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label className="form-control-label" htmlFor="idCliente">
                            Cliente *
                          </Label>
                          <Input
                            className="form-control-alternative"
                            id="idCliente"
                            name="idCliente"
                            type="select"
                            value={factura.idCliente}
                            onChange={(e) => handleFacturaChange('idCliente', e.target.value)}
                            required
                          >
                            <option value="">Seleccionar cliente...</option>
                            {clientes.map(cliente => (
                              <option key={cliente.idCliente} value={cliente.idCliente}>
                                 {cliente.persona?.Pnombre} {cliente.persona?.Snombre} {cliente.persona?.Papellido} {cliente.persona?.Sapellido}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg="6">  
                        <FormGroup>  
                          <Label className="form-control-label" htmlFor="DNI">
                            DNI *
                          </Label>  
                          <Input  
                            className="form-control-alternative"  
                            id="DNI"
                            name="DNI"
                            type="text"  
                            value={obtenerDNICliente()}
                            readOnly
                            placeholder="Seleccione cliente"
                            style={{ backgroundColor: '#f8f9fa' }}
                          />  
                        </FormGroup>  
                      </Col>  
                    </Row>  
                  </div>  
  
                  <hr className="my-4" />  
  
                  {/* Detalles de Productos */}  
                  <h6 className="heading-small text-muted mb-4">  
                    Productos y Servicios
                  </h6>  
                  <div className="pl-lg-4">  
                    
                    <Table className="align-items-center table-flush" responsive>  
                      <thead className="thead-light">  
                        <tr>  
                          <th>Cantidad *</th>  
                          <th>Producto/Servicio *</th>
                          <th>Precio Unitario</th>
                          <th>Total</th>
                          <th></th>
                        </tr>  
                      </thead>  
                      <tbody>  
                        {detalles.map((detalle, index) => (  
                          <tr key={index}>  
                            <td>  
                              <Input  
                                type="number"  
                                min="1"  
                                value={detalle.cantidad}  
                                onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}  
                                required  
                                maxLength="5"
                                max="99999"
                              />  
                            </td>  
                            <td>
                              {detalle.isManualEntry ? (
                                // Entrada manual para servicios personalizados
                                <div>
                                  <Input
                                    type="text"
                                    placeholder="Nombre del servicio..."
                                    value={detalle.nombreProducto || ''}
                                    onChange={(e) => handleDetalleChange(index, 'nombreProducto', e.target.value)}
                                    required
                                    className="mb-2"
                                  />
                                  <Input
                                    type="text"
                                    placeholder="Descripción (opcional)"
                                    value={detalle.descripcionProducto || ''}
                                    onChange={(e) => handleDetalleChange(index, 'descripcionProducto', e.target.value)}
                                    className="mb-2"
                                  />
                                  <Button
                                    color="secondary"
                                    size="sm"
                                    onClick={() => toggleManualEntry(index)}
                                    className="w-100"
                                  >
                                    <i className="fas fa-list mr-1" />
                                    Seleccionar Producto
                                  </Button>
                                </div>
                              ) : (
                                // Dropdown para productos existentes
                                <div>
                                  <Input
                                    type="select"
                                    value={detalle.idProducto}
                                    onChange={(e) => handleDetalleChange(index, 'idProducto', e.target.value)}
                                    required
                                    className="mb-2"
                                  >
                                    <option value="">Seleccionar producto/servicio...</option>
                                    {productos.map(producto => {
                                      const nombre = producto.Nombre || producto.nombre || 'Sin nombre';
                                      const precio = producto.precioVenta || 0;
                                      const categoria = producto.Categoria || producto.categoria || '';
                                      const descripcion = producto.Descripcion || producto.descripcion || '';
                                      
                                      return (
                                        <option key={producto.idProducto} value={producto.idProducto}>
                                          {nombre} - L. {precio.toFixed(2)}
                                          {categoria && ` (${categoria})`}
                                          {descripcion && descripcion.length > 30 ? ` - ${descripcion.substring(0, 30)}...` : descripcion ? ` - ${descripcion}` : ''}
                                        </option>
                                      );
                                    })}
                                  </Input>
                                  <Button
                                    color="info"
                                    size="sm"
                                    onClick={() => toggleManualEntry(index)}
                                    className="w-100"
                                  >
                                    <i className="fas fa-edit mr-1" />
                                    Entrada Manual
                                  </Button>
                                </div>
                              )}
                            </td>
                            <td>
                              <InputGroup style={{ width: '120px' }}>
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>L. </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={detalle.precioUnitario || 0}
                                  onChange={(e) => handleDetalleChange(index, 'precioUnitario', e.target.value)}
                                  disabled={!detalle.isManualEntry}
                                  className="text-right"
                                />
                              </InputGroup>
                            </td>
                            <td>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>L. </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                  type="text"
                                  value={detalle.total ? detalle.total.toFixed(2) : '0.00'}
                                  disabled
                                  className="text-right"
                                />
                              </InputGroup>
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
                      <i className="fas fa-plus" /> Agregar Producto/Servicio
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
                            <th>Descuento</th>
                            <th>Monto (L.)</th>
                            <th>Acciones</th>  
                          </tr>  
                        </thead>  
                        <tbody>  
                          {descuentos.map((descuento, index) => (  
                            <tr key={index}>  
                              <td>  
                                <Input  
                                  type="select"
                                  value={descuento.idDescuento}  
                                  onChange={(e) => handleDescuentoChange(index, 'idDescuento', e.target.value)}  
                                >
                                  <option value="">Seleccionar descuento...</option>
                                  {descuentosDisponibles.map(desc => (
                                    <option key={desc.idDescuento} value={desc.idDescuento}>
                                      {desc.Tipo} - {desc.Porcentaje}%
                                    </option>
                                  ))}
                                </Input>
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
  
                  {/* Resumen de Totales */}
                  <h6 className="heading-small text-muted mb-4">
                    Resumen de Totales
                  </h6>
                  <div className="pl-lg-4">  
                    <Row>  
                      <Col lg="6" className="ml-auto">
                        <Table className="table-flush" responsive>
                          <tbody>
                            <tr>
                              <td><strong>Subtotal:</strong></td>
                              <td className="text-right">L. {calculoAutomatico.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td><strong>Descuentos:</strong></td>
                              <td className="text-right">L. {calculoAutomatico.descuentos.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td><strong>Subtotal con Descuento:</strong></td>
                              <td className="text-right">L. {calculoAutomatico.subtotalConDescuento.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td><strong>ISV (15%):</strong></td>
                              <td className="text-right">L. {calculoAutomatico.isv.toFixed(2)}</td>
                            </tr>
                            <tr className="table-active">
                              <td><strong>Total:</strong></td>
                              <td className="text-right"><strong>L. {calculoAutomatico.total.toFixed(2)}</strong></td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>  
                    </Row>  
                  </div>  
  
                  <hr className="my-4" />

                  {/* Botones de Acción */}
                  <div className="pl-lg-4">  
                    <Row>
                      <Col lg="12" className="text-right">
                        <Button
                          color="secondary"
                          className="mr-3"
                          onClick={() => window.history.back()}
                        >
                          Cancelar
                        </Button>
                    <Button  
                      color="primary"  
                      type="submit"  
                      disabled={loading}  
                    >  
                      {loading ? (  
                        <>  
                              <i className="fas fa-spinner fa-spin mr-2" />
                              Creando Factura...
                        </>  
                      ) : (  
                        <>  
                              <i className="fas fa-save mr-2" />
                              Crear Factura
                        </>  
                      )}  
                    </Button>  
                      </Col>
                    </Row>
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