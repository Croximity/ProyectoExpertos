import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Table,
  Input,
  Button,
  FormGroup,
  Label,
  Badge,
  Spinner,
  Alert
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import HeaderBlanco from "components/Headers/HeaderBlanco";
import { facturaService } from "../../services/facturacion/facturaService";

const PanelFacturacion = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    cliente: "",
    fecha: "",
    estado: "",
  });

  const [facturas, setFacturas] = useState([]);
  const [resumen, setResumen] = useState({
    totalMes: 0,
    emitidas: 0,
    pendientes: 0,
    pagadas: 0,
    anuladas: 0
  });

  const [porTipo, setPorTipo] = useState({
    consulta: 0,
    producto: 0,
    servicio: 0,
    mixto: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [estadoCAI, setEstadoCAI] = useState({
    activo: true,
    rango: "000-001-01-00000001 a 000-001-01-00000100",
    vencimiento: "2025-08-30",
    emitidas: 0,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const estadisticas = await facturaService.obtenerEstadisticas();
      
      setResumen(estadisticas.resumen);
      setPorTipo(estadisticas.porTipo);
      setFacturas(estadisticas.ultimasFacturas);
      
      // Actualizar estado CAI con datos reales
      setEstadoCAI(prev => ({
        ...prev,
        emitidas: estadisticas.resumen.emitidas
      }));
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos de facturación');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const facturasFiltradas = facturas.filter((factura) => {
    return (
      (filtros.cliente === "" ||
        factura.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) &&
      (filtros.fecha === "" || factura.fecha === filtros.fecha) &&
      (filtros.estado === "" || factura.estado === filtros.estado)
    );
  });

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-HN');
  };

  const formatearMoneda = (monto) => {
    return `L. ${parseFloat(monto || 0).toFixed(2)}`;
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'cobrada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'anulada':
        return 'danger';
      case 'activa':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case 'cobrada':
        return 'Pagada';
      case 'pendiente':
        return 'Pendiente';
      case 'anulada':
        return 'Anulada';
      case 'activa':
        return 'Activa';
      default:
        return estado;
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'consulta':
        return 'Consulta';
      case 'producto':
        return 'Producto';
      case 'servicio':
        return 'Servicio';
      case 'mixto':
        return 'Mixto';
      default:
        return tipo;
    }
  };

  if (loading) {
    return (
      <>
        <HeaderBlanco />
        <Container className="mt-4">
          <Row className="justify-content-center">
            <Col className="text-center">
              <Spinner color="primary" />
              <p className="mt-2">Cargando datos de facturación...</p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <HeaderBlanco />
      <Container className="mt-4">
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
            <Button color="link" onClick={cargarDatos} className="p-0 ml-2">
              Reintentar
            </Button>
          </Alert>
        )}

        {/* ACCIONES DEL MÓDULO DE FACTURACIÓN */}
        <Row className="mb-4">
          <Col md="3" className="mb-4">
            <Card className="shadow border-0 h-70">
              <CardBody className="text-center">
                <i className="ni ni-fat-add mr-2 text-primary" />
                <Button color="primary" onClick={() => navigate('/admin/crear-factura-nueva')}>
                  Crear Factura
                </Button>
              </CardBody>
            </Card>
          </Col>

          <Col md="3" className="mb-4">
            <Card className="shadow border-0 h-70">
              <CardBody className="text-center">
                <i className="ni ni-credit-card mr-2 text-info" />
                <Button color="info" onClick={() => navigate('/admin/facturacion/pagos')}>
                  Registrar Pago
                </Button>
              </CardBody>
            </Card>
          </Col>


          <Col md="3" className="mb-4">
            <Card className="shadow border-0 h-70">
              <CardBody className="text-center">
                <i className="ni ni-tag mr-2 text-default" />
                <Button color="default" onClick={() => navigate('/admin/facturacion/cai')}>
                  Administrar CAI
                </Button>
              </CardBody>
            </Card>
          </Col>

          <Col md="3" className="mb-4">
            <Card className="shadow border-0 h-70">
              <CardBody className="text-center">
                <i className="ni ni-archive-2 mr-2 text-danger" />
                <Button color="danger" onClick={() => navigate('/admin/facturas')}>
                  Ver Historial
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* MÉTRICAS RESUMIDAS */}
        <Row className="mb-4">
          <Col md="2" sm="6" xs="6" className="mb-3">
            <Card className="card-stats shadow border-0">
              <CardBody className="py-3 px-3 text-center">
                <div className="text-primary">
                  <i className="ni ni-money-coins display-4" />
                </div>
                <small className="text-muted">Facturado</small>
                <h4 className="text-primary">{formatearMoneda(resumen.totalMes)}</h4>
              </CardBody>
            </Card>
          </Col>

          <Col md="2" sm="6" xs="6" className="mb-3">
            <Card className="card-stats shadow border-0">
              <CardBody className="py-3 px-3 text-center">
                <div className="text-success">
                  <i className="ni ni-check-bold display-4" />
                </div>
                <small className="text-muted">Emitidas</small>
                <h4 className="text-success">{resumen.emitidas}</h4>
              </CardBody>
            </Card>
          </Col>

          <Col md="2" sm="6" xs="6" className="mb-3">
            <Card className="card-stats shadow border-0">
              <CardBody className="py-3 px-3 text-center">
                <div className="text-warning">
                  <i className="ni ni-time-alarm display-4" />
                </div>
                <small className="text-muted">Pendientes</small>
                <h4 className="text-warning">{resumen.pendientes}</h4>
              </CardBody>
            </Card>
          </Col>

          <Col md="2" sm="6" xs="6" className="mb-3">
            <Card className="card-stats shadow border-0">
              <CardBody className="py-3 px-3 text-center">
                <div className="text-info">
                  <i className="ni ni-check-bold display-4" />
                </div>
                <small className="text-muted">Pagadas</small>
                <h4 className="text-info">{resumen.pagadas}</h4>
              </CardBody>
            </Card>
          </Col>

          <Col md="2" sm="6" xs="6" className="mb-3">
            <Card className="card-stats shadow border-0">
              <CardBody className="py-3 px-3 text-center">
                <div className="text-danger">
                  <i className="ni ni-tag display-4" />
                </div>
                <small className="text-muted">Anuladas</small>
                <h4 className="text-danger">{resumen.anuladas}</h4>
              </CardBody>
            </Card>
          </Col>

          <Col md="2" sm="6" xs="6" className="mb-3">
            <Card className="card-stats shadow border-0">
              <CardBody className="py-3 px-3 text-center">
                <div className="text-dark">
                  <i className="ni ni-credit-card display-4" />
                </div>
                <small className="text-muted">Total</small>
                <h4 className="text-dark">{resumen.emitidas + resumen.pendientes + resumen.pagadas + resumen.anuladas}</h4>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* ESTADÍSTICAS POR TIPO */}
        <Row className="mb-4">
          <Col md="12">
            <Card className="shadow border-0">
              <CardHeader>
                <h5 className="mb-0">Estadísticas por Tipo de Facturación</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="3" className="text-center">
                    <div className="text-primary">
                      <i className="ni ni-single-02 display-4" />
                    </div>
                    <h5>Consultas</h5>
                    <h3 className="text-primary">{porTipo.consulta}</h3>
                  </Col>
                  <Col md="3" className="text-center">
                    <div className="text-success">
                      <i className="ni ni-box-2 display-4" />
                    </div>
                    <h5>Productos</h5>
                    <h3 className="text-success">{porTipo.producto}</h3>
                  </Col>
                  <Col md="3" className="text-center">
                    <div className="text-info">
                      <i className="ni ni-settings display-4" />
                    </div>
                    <h5>Servicios</h5>
                    <h3 className="text-info">{porTipo.servicio}</h3>
                  </Col>
                  <Col md="3" className="text-center">
                    <div className="text-warning">
                      <i className="ni ni-collection display-4" />
                    </div>
                    <h5>Mixtos</h5>
                    <h3 className="text-warning">{porTipo.mixto}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* FILTROS Y TABLA */}
        <Card className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Últimas Facturas</h5>
          </CardHeader>
          <CardBody>
            <Row form className="mb-3">
              <Col md={4}>
                <FormGroup>
                  <Label>Cliente</Label>
                  <Input 
                    name="cliente" 
                    value={filtros.cliente}
                    onChange={handleFiltro} 
                    placeholder="Buscar cliente" 
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Fecha</Label>
                  <Input 
                    type="date" 
                    name="fecha" 
                    value={filtros.fecha}
                    onChange={handleFiltro} 
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Estado</Label>
                  <Input 
                    type="select" 
                    name="estado" 
                    value={filtros.estado}
                    onChange={handleFiltro}
                  >
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cobrada">Pagada</option>
                    <option value="activa">Activa</option>
                    <option value="anulada">Anulada</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Table responsive striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Tipo</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No hay facturas que coincidan con los filtros.
                    </td>
                  </tr>
                ) : (
                  facturasFiltradas.map((factura, index) => (
                    <tr key={factura.id}>
                      <td>{factura.id}</td>
                      <td>{factura.cliente}</td>
                      <td>{formatearFecha(factura.fecha)}</td>
                      <td>
                        <Badge color={getBadgeColor(factura.estado)}>
                          {getEstadoLabel(factura.estado)}
                        </Badge>
                      </td>
                      <td>
                        <Badge color="secondary">
                          {getTipoLabel(factura.tipo)}
                        </Badge>
                      </td>
                      <td>{formatearMoneda(factura.total)}</td>
                      <td>
                        <Button 
                          size="sm" 
                          color="info" 
                          onClick={() => facturaService.descargarPDF(factura.id)}
                        >
                          <i className="ni ni-single-copy-04" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>

        {/* ESTADO DEL CAI */}
        <Card className="mb-4">
          <CardHeader>
            <strong>Estado del CAI</strong>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md="6">
                <p><strong>Rango:</strong> {estadoCAI.rango}</p>
                <p><strong>Facturas emitidas:</strong> {estadoCAI.emitidas}</p>
              </Col>
              <Col md="6">
                <p>
                  <strong>Válido hasta:</strong>{" "}
                  <Badge color={new Date(estadoCAI.vencimiento) < new Date() ? "danger" : "success"}>
                    {estadoCAI.vencimiento}
                  </Badge>
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <Badge color={estadoCAI.activo ? "success" : "danger"}>
                    {estadoCAI.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default PanelFacturacion;
