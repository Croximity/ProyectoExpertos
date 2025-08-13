// Dashboard principal mejorado con información de todos los módulos
import { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Badge,
  Spinner,
  Alert
} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUserTie,
  faEye,
  faPrescription,
  faStethoscope,
  faVirus,
  faTools,
  faFileInvoiceDollar,
  faChartLine,
  faCalendarAlt,
  faMoneyBillWave,
  faShoppingCart,
  faClipboardCheck,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faArrowUp,
  faArrowDown,
  faRefresh,
  faBug
} from '@fortawesome/free-solid-svg-icons';
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../services/dashboardService";
import { testService } from "../services/testService";
import { testFacturaService } from "../services/testFacturaService";
import { backendConfig, verificarEstadoBackend } from "../services/backendConfig";

const Index = () => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [stats, setStats] = useState({
    clientes: { total: 0, nuevos: 0, activos: 0 },
    empleados: { total: 0, activos: 0 },
    productos: { total: 0, stockBajo: 0, categorias: 0 },
    consultas: { total: 0, pendientes: 0, completadas: 0 },
    facturas: { total: 0, mes: 0, pendientes: 0, pagadas: 0 },
    ingresos: { mes: 0, semana: 0, tendencia: 'up', porcentajeTendencia: 0 }
  });
  const [facturasRecientes, setFacturasRecientes] = useState([]);
  const [consultasPendientes, setConsultasPendientes] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [datosGraficos, setDatosGraficos] = useState({
    datosIngresos: { labels: [], datasets: [{ data: [] }] },
    datosProductos: { labels: [], datasets: [{ data: [] }] }
  });
  const navigate = useNavigate();

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo({});

      console.log('🔄 Iniciando carga de datos del dashboard...');

      // Cargar todos los datos en paralelo
      const [
        estadisticas,
        facturas,
        consultas,
        productos,
        graficos
      ] = await Promise.allSettled([
        dashboardService.obtenerEstadisticasCompletas(),
        dashboardService.obtenerFacturasRecientes(5),
        dashboardService.obtenerConsultasPendientes(),
        dashboardService.obtenerProductosStockBajo(10),
        dashboardService.obtenerDatosGraficos()
      ]);

      console.log('📊 Resultados de las consultas:', {
        estadisticas: estadisticas.status,
        facturas: facturas.status,
        consultas: consultas.status,
        productos: productos.status,
        graficos: graficos.status
      });

      // Procesar estadísticas
      if (estadisticas.status === 'fulfilled') {
        console.log('✅ Estadísticas cargadas:', estadisticas.value);
        setStats(estadisticas.value);
      } else {
        console.error('❌ Error en estadísticas:', estadisticas.reason);
        setDebugInfo(prev => ({ ...prev, estadisticas: estadisticas.reason }));
      }

      // Procesar facturas recientes
      if (facturas.status === 'fulfilled') {
        console.log('✅ Facturas cargadas:', facturas.value);
        setFacturasRecientes(facturas.value);
      } else {
        console.error('❌ Error en facturas:', facturas.reason);
        setDebugInfo(prev => ({ ...prev, facturas: facturas.reason }));
      }

      // Procesar consultas pendientes
      if (consultas.status === 'fulfilled') {
        console.log('✅ Consultas cargadas:', consultas.value);
        setConsultasPendientes(consultas.value);
      } else {
        console.error('❌ Error en consultas:', consultas.reason);
        setDebugInfo(prev => ({ ...prev, consultas: consultas.reason }));
      }

      // Procesar productos con stock bajo
      if (productos.status === 'fulfilled') {
        console.log('✅ Productos cargados:', productos.value);
        setProductosStockBajo(productos.value);
      } else {
        console.error('❌ Error en productos:', productos.reason);
        setDebugInfo(prev => ({ ...prev, productos: productos.reason }));
      }

      // Procesar datos de gráficos
      if (graficos.status === 'fulfilled') {
        console.log('✅ Gráficos cargados:', graficos.value);
        setDatosGraficos(graficos.value);
      } else {
        console.error('❌ Error en gráficos:', graficos.reason);
        setDebugInfo(prev => ({ ...prev, graficos: graficos.reason }));
      }

      // Verificar si al menos algunos datos se cargaron
      const datosCargados = [
        estadisticas.status === 'fulfilled',
        facturas.status === 'fulfilled',
        consultas.status === 'fulfilled',
        productos.status === 'fulfilled',
        graficos.status === 'fulfilled'
      ].filter(Boolean).length;

      // Solo mostrar error si no se cargó ningún dato
      if (datosCargados === 0) {
        setError('No se pudieron cargar los datos del dashboard. Verifica la conexión con el servidor.');
      } else {
        // Si se cargaron algunos datos, no mostrar error
        setError(null);
        console.log(`✅ Dashboard cargado con ${datosCargados}/5 fuentes de datos`);
      }

    } catch (error) {
      console.error('💥 Error general al cargar datos del dashboard:', error);
      setError(`Error al cargar los datos: ${error.message}`);
      setDebugInfo({ errorGeneral: error });
    } finally {
      setLoading(false);
    }
  };

  const ejecutarDiagnostico = async () => {
    try {
      console.log('🔧 Ejecutando diagnóstico completo...');
      
      // Verificar configuración
      const config = testService.verificarConfiguracion();
      console.log('📋 Configuración:', config);
      
      // Probar conexión básica
      const conexion = await testService.probarConexion();
      console.log('🔗 Prueba de conexión:', conexion);
      
      // Probar todos los endpoints
      const endpoints = await testService.probarTodosLosEndpoints();
      console.log('🌐 Prueba de endpoints:', endpoints);
      
      // Verificar estado del backend
      const estadoBackend = verificarEstadoBackend();
      console.log('📊 Estado del backend:', estadoBackend);
      
      // Actualizar debug info
      setDebugInfo({
        configuracion: config,
        conexion: conexion,
        endpoints: endpoints,
        estadoBackend: estadoBackend
      });
      
      alert('Diagnóstico completado. Revisa la consola y la información de debug.');
      
    } catch (error) {
      console.error('❌ Error en diagnóstico:', error);
      alert(`Error en diagnóstico: ${error.message}`);
    }
  };

     const mostrarEstadoBackend = () => {
     verificarEstadoBackend();
     alert('Estado del backend mostrado en consola. Revisa F12 → Console');
   };

   const probarServicioFacturas = async () => {
     try {
       console.log('🧪 Probando servicio de facturas...');
       
       // Probar obtención básica
       const resultadoBasico = await testFacturaService.probarObtenerFacturas();
       console.log('📊 Resultado básico:', resultadoBasico);
       
       // Probar obtención con límite
       const resultadoConLimite = await testFacturaService.probarObtenerFacturasConLimite(5);
       console.log('📊 Resultado con límite:', resultadoConLimite);
       
       if (resultadoBasico.success) {
         alert(`✅ Servicio de facturas funcionando. ${resultadoBasico.data.length} facturas encontradas. Revisa la consola para más detalles.`);
       } else {
         alert(`❌ Error en servicio de facturas: ${resultadoBasico.error}`);
       }
       
     } catch (error) {
       console.error('❌ Error al probar servicio de facturas:', error);
       alert(`Error al probar servicio: ${error.message}`);
     }
   };

  // Datos para gráfico de consultas semanales (simulado por ahora)
  const datosConsultas = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Consultas diarias",
        data: [12, 19, 15, 22, 18, 8, 5],
        backgroundColor: [
          "#11cdef",
          "#f3a4b5",
          "#fb6340",
          "#2dce89",
          "#5e72e4",
          "#f5365c",
          "#8898aa"
        ]
      }
    ]
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'cobrada':
      case 'Pagada': 
        return <Badge color="success">Pagada</Badge>;
      case 'pendiente':
      case 'Pendiente': 
        return <Badge color="warning">Pendiente</Badge>;
      case 'anulada':
      case 'Anulada': 
        return <Badge color="danger">Anulada</Badge>;
      default: 
        return <Badge color="secondary">{estado}</Badge>;
    }
  };

  const getPrioridadBadge = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return <Badge color="danger">{prioridad}</Badge>;
      case 'Media': return <Badge color="warning">{prioridad}</Badge>;
      case 'Baja': return <Badge color="info">{prioridad}</Badge>;
      default: return <Badge color="secondary">{prioridad}</Badge>;
    }
  };

  const getStockBadge = (stock, minimo) => {
    if (stock <= minimo * 0.3) return <Badge color="danger">Crítico</Badge>;
    if (stock <= minimo * 0.6) return <Badge color="warning">Bajo</Badge>;
    return <Badge color="success">Normal</Badge>;
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row className="justify-content-center">
            <Col className="text-center">
              <Spinner color="primary" size="lg" />
              <p className="mt-3 text-muted">Cargando panel de control...</p>
              <small className="text-muted">Conectando con la base de datos...</small>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Alert color="danger">
            <h4 className="alert-heading">Error al cargar el dashboard</h4>
            <p>{error}</p>
            
            {Object.keys(debugInfo).length > 0 && (
              <div className="mt-3">
                <h6>Información de debug:</h6>
                <pre className="bg-light p-2 rounded" style={{fontSize: '12px'}}>
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
            
            <hr />
            <div className="d-flex gap-2">
              <Button color="primary" onClick={cargarDatosDashboard}>
                <FontAwesomeIcon icon={faRefresh} className="me-2" />
                Reintentar
              </Button>
              <Button color="warning" onClick={ejecutarDiagnostico}>
                <FontAwesomeIcon icon={faBug} className="me-2" />
                Ejecutar Diagnóstico
              </Button>
              <Button color="secondary" onClick={() => window.location.reload()}>
                Recargar página
              </Button>
            </div>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        {/* Encabezado del Dashboard */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow border-0">
              <CardBody className="bg-gradient-primary text-white">
                <Row className="align-items-center">
                  <Col>
                    <h1 className="display-4 font-weight-bold mb-2">Panel de Control</h1>
                    <p className="mb-0 opacity-75">Bienvenido al sistema de gestión integral</p>
                  </Col>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-white text-primary rounded-circle shadow" style={{width: '80px', height: '80px'}}>
                      <FontAwesomeIcon icon={faChartLine} size="2x" />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Botón de diagnóstico */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody className="text-center">
                                 <Row>
                   <Col md="4">
                     <Button color="warning" onClick={ejecutarDiagnostico} className="mb-2 mb-md-0">
                       <FontAwesomeIcon icon={faBug} className="me-2" />
                       Diagnóstico de Conexión
                     </Button>
                   </Col>
                   <Col md="4">
                     <Button color="info" onClick={mostrarEstadoBackend}>
                       <FontAwesomeIcon icon={faChartLine} className="me-2" />
                       Estado del Backend
                     </Button>
                   </Col>
                   <Col md="4">
                     <Button color="success" onClick={probarServicioFacturas}>
                       <FontAwesomeIcon icon={faFileInvoiceDollar} className="me-2" />
                       Probar Facturas
                     </Button>
                   </Col>
                 </Row>
                                 <p className="text-muted mt-2 mb-0">
                   Usa los botones para diagnosticar problemas y probar el servicio de facturas
                 </p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Tarjetas de estadísticas principales */}
        <Row className="mb-4">
          <Col lg="3" md="6">
            <Card className="card-stats mb-4 mb-xl-0 shadow">
              <CardBody>
                <Row>
                  <Col>
                    <h5 className="card-title text-uppercase text-muted mb-0">Clientes</h5>
                    <span className="h2 font-weight-bold mb-0">{stats.clientes.total}</span>
                    <p className="text-success text-sm mb-0">
                      <FontAwesomeIcon icon={faArrowUp} /> +{stats.clientes.nuevos} este mes
                    </p>
                  </Col>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6">
            <Card className="card-stats mb-4 mb-xl-0 shadow">
              <CardBody>
                <Row>
                  <Col>
                    <h5 className="card-title text-uppercase text-muted mb-0">Ingresos del Mes</h5>
                    <span className="h2 font-weight-bold mb-0">L {stats.ingresos.mes.toLocaleString()}</span>
                    <p className={`text-${stats.ingresos.tendencia === 'up' ? 'success' : 'danger'} text-sm mb-0`}>
                      <FontAwesomeIcon icon={stats.ingresos.tendencia === 'up' ? faArrowUp : faArrowDown} /> 
                      {stats.ingresos.porcentajeTendencia}% vs mes anterior
                    </p>
                  </Col>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-gradient-success text-white rounded-circle shadow">
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6">
            <Card className="card-stats mb-4 mb-xl-0 shadow">
              <CardBody>
                <Row>
                  <Col>
                    <h5 className="card-title text-uppercase text-muted mb-0">Consultas</h5>
                    <span className="h2 font-weight-bold mb-0">{stats.consultas.total}</span>
                    <p className="text-warning text-sm mb-0">
                      <FontAwesomeIcon icon={faExclamationTriangle} /> {stats.consultas.pendientes} pendientes
                    </p>
                  </Col>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                      <FontAwesomeIcon icon={faStethoscope} />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6">
            <Card className="card-stats mb-4 mb-xl-0 shadow">
              <CardBody>
                <Row>
                  <Col>
                    <h5 className="card-title text-uppercase text-muted mb-0">Productos</h5>
                    <span className="h2 font-weight-bold mb-0">{stats.productos.total}</span>
                    <p className="text-danger text-sm mb-0">
                      <FontAwesomeIcon icon={faExclamationTriangle} /> {stats.productos.stockBajo} stock bajo
                    </p>
                  </Col>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-gradient-warning text-white rounded-circle shadow">
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Gráficos principales */}
        <Row className="mb-4">
          <Col xl="8">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                <h3 className="mb-0">Ingresos mensuales</h3>
                    <p className="text-muted mb-0">Evolución de ingresos en los últimos 7 meses</p>
                  </Col>
                  <Col className="col-auto">
                    <Button color="primary" size="sm" onClick={() => navigate('/admin/facturacion')}>
                      Ver Detalles
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  {datosGraficos.datosIngresos.labels.length > 0 ? (
                    <Line 
                      data={datosGraficos.datosIngresos} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return 'L ' + value.toLocaleString();
                              }
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="text-center text-muted py-5">
                      <FontAwesomeIcon icon={faChartLine} size="3x" className="mb-3" />
                      <p>No hay datos de ingresos disponibles</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Distribución de Productos</h3>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{height: '250px'}}>
                  {datosGraficos.datosProductos.labels.length > 0 ? (
                    <Doughnut 
                      data={datosGraficos.datosProductos}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="text-center text-muted py-5">
                      <FontAwesomeIcon icon={faShoppingCart} size="3x" className="mb-3" />
                      <p>No hay datos de productos disponibles</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Tablas de información */}
        <Row className="mb-4">
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                <h3 className="mb-0">Facturas recientes</h3>
                  </Col>
                  <Col className="col-auto">
                    <Button color="primary" size="sm" onClick={() => navigate('/admin/facturacion')}>
                      Ver Todas
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Número</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Total</th>
                    <th scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {facturasRecientes.length > 0 ? (
                    facturasRecientes.map((factura, index) => (
                    <tr key={index}>
                        <td>
                          <span className="font-weight-bold">{factura.numero}</span>
                        </td>
                      <td>{factura.cliente}</td>
                        <td>L {factura.total.toLocaleString()}</td>
                        <td>{getEstadoBadge(factura.estado)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} className="me-2" />
                        No hay facturas recientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">Consultas pendientes</h3>
                  </Col>
                  <Col className="col-auto">
                    <Button color="info" size="sm" onClick={() => navigate('/admin/consulta-examenes')}>
                      Ver Todas
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Paciente</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {consultasPendientes.length > 0 ? (
                    consultasPendientes.map((consulta, index) => (
                      <tr key={index}>
                        <td>
                          <span className="font-weight-bold">{consulta.paciente}</span>
                    </td>
                        <td>{consulta.tipo}</td>
                        <td>{consulta.fecha}</td>
                        <td>{getPrioridadBadge(consulta.prioridad)}</td>
                  </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                        No hay consultas pendientes
                    </td>
                  </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>

        {/* Productos con stock bajo y estadísticas adicionales */}
        <Row className="mb-4">
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">Productos con stock bajo</h3>
                  </Col>
                  <Col className="col-auto">
                    <Button color="warning" size="sm" onClick={() => navigate('/admin/productos')}>
                      Gestionar
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Mínimo</th>
                    <th scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {productosStockBajo.length > 0 ? (
                    productosStockBajo.map((producto, index) => (
                      <tr key={index}>
                        <td>
                          <span className="font-weight-bold">{producto.nombre}</span>
                          <br />
                          <small className="text-muted">{producto.categoria}</small>
                    </td>
                        <td>{producto.stock}</td>
                        <td>{producto.minimo}</td>
                        <td>{getStockBadge(producto.stock, producto.minimo)}</td>
                  </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                        No hay productos con stock bajo
                    </td>
                  </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Actividad de la semana</h3>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{height: '250px'}}>
                  <Bar 
                    data={datosConsultas}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Accesos rápidos a módulos */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Accesos rápidos</h3>
                <p className="text-muted mb-0">Navega rápidamente a los módulos principales</p>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg="3" md="6" className="mb-3">
                    <Button 
                      color="primary" 
                      block 
                      className="p-3 h-100 d-flex flex-column align-items-center justify-content-center"
                      onClick={() => navigate('/admin/gestion-cliente')}
                    >
                      <FontAwesomeIcon icon={faUsers} size="2x" className="mb-2" />
                      <span>Gestión de Clientes</span>
                    </Button>
                  </Col>
                  <Col lg="3" md="6" className="mb-3">
                    <Button 
                      color="success" 
                      block 
                      className="p-3 h-100 d-flex flex-column align-items-center justify-content-center"
                      onClick={() => navigate('/admin/consulta-examenes')}
                    >
                      <FontAwesomeIcon icon={faStethoscope} size="2x" className="mb-2" />
                      <span>Consultas y Exámenes</span>
                    </Button>
                  </Col>
                  <Col lg="3" md="6" className="mb-3">
                    <Button 
                      color="warning" 
                      block 
                      className="p-3 h-100 d-flex flex-column align-items-center justify-content-center"
                      onClick={() => navigate('/admin/productos')}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} size="2x" className="mb-2" />
                      <span>Productos e Inventario</span>
                    </Button>
                  </Col>
                  <Col lg="3" md="6" className="mb-3">
                    <Button 
                      color="info" 
                      block 
                      className="p-3 h-100 d-flex flex-column align-items-center justify-content-center"
                      onClick={() => navigate('/admin/facturacion')}
                    >
                      <FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" className="mb-2" />
                      <span>Facturación</span>
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;