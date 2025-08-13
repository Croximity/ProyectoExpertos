import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
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
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow mb-4">
            <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                    <h5 className="h3 mb-0">
                    Panel de Control de Facturación

                    </h5>
                    <p className="text-muted mb-0 mt-2">
                    Gestiona facturas, pagos, CAI y configuraciones del sistema de facturación
                    </p>
                  </Col>
                </Row>
              </CardHeader>
            </Card>

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
                <Col md="3" sm="6" className="mb-4">
                  <Card className="shadow border-0 h-100">
                    <CardBody className="text-center">
                      <i className="ni ni-archive-2 mr-2 text-danger" />
                      <Button color="danger" onClick={() => navigate('/admin/facturas')}>
                        Ver Facturas
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="3" sm="6" className="mb-4">
                  <Card className="shadow border-0 h-100">
                    <CardBody className="text-center">
                      <i className="ni ni-fat-add mr-2 text-primary" />
                      <Button color="primary" onClick={() => navigate('/admin/crear-factura-nueva')}>
                        Crear Factura
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="3" sm="6" className="mb-4">
                  <Card className="shadow border-0 h-100">
                    <CardBody className="text-center">
                      <i className="ni ni-credit-card mr-2 text-info" />
                      <Button color="info" onClick={() => navigate('/admin/facturacion/pagos')}>
                        Registrar Pago
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="3" sm="6" className="mb-4">
                  <Card className="shadow border-0 h-100">
                    <CardBody className="text-center">
                      <i className="ni ni-tag mr-2 text-warning" />
                      <Button color="warning" onClick={() => navigate('/admin/facturacion/cai')}>
                        Administrar CAI
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* ACCIONES ADICIONALES DE FACTURACIÓN */}
              <Row className="mb-4">



                <Col md="3" sm="6" className="mb-4">
                  <Card className="shadow border-0 h-100">
                    <CardBody className="text-center">
                      <i className="ni ni-credit-card mr-2 text-success" />
                      <Button color="success" onClick={() => navigate('/admin/facturacion/formas-pago')}>
                        Formas de Pago
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              

              {/* GESTIÓN DE DESCUENTOS */}
              
                <Col md="3" sm="6" className="mb-4">
                  <Card className="shadow border-0 h-100">
                    <CardBody className="text-center">
                      <i className="ni ni-tag mr-2 text-warning" />
                      <Button color="warning" onClick={() => navigate('/admin/facturacion/descuentos')}>
                        Gestionar Descuentos
                      </Button>
                    </CardBody>
                  </Card>
                </Col>

              </Row>

              </Col></Row> </Container>


              {/* ESTADO DEL CAI */}
              <Container className="" fluid><Row><Col>
              <Card className="shadow mb-4">
                <CardHeader className="bg-transparent">
                  <h5 className="h3 mb-0">
                    Estado del CAI
                  </h5>
                  <p className="text-muted mb-0 mt-2">
                    Control de Autorización de Impresión
                  </p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={3} sm={6} xs={12} className="text-center mb-3">
                      <div className="icon icon-shape bg-gradient-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: '50px', height: '50px'}}>
                        <i className={`ni ${estadoCAI.activo ? 'ni-check-bold' : 'ni-fat-remove'} text-white`}></i>
                      </div>
                      <h4 className={estadoCAI.activo ? "text-success" : "text-danger"}>
                        {estadoCAI.activo ? "Activo" : "Inactivo"}
                      </h4>
                      <small className="text-muted">Estado del CAI</small>
                    </Col>
                    <Col md={3} sm={6} xs={12} className="text-center mb-3">
                      <div className="icon icon-shape bg-gradient-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: '50px', height: '50px'}}>
                        <i className="ni ni-tag text-white"></i>
                      </div>
                      <h4 className="text-info">{estadoCAI.rango}</h4>
                      <small className="text-muted">Rango de Facturación</small>
                    </Col>
                    <Col md={3} sm={6} xs={12} className="text-center mb-3">
                      <div className="icon icon-shape bg-gradient-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: '50px', height: '50px'}}>
                        <i className="ni ni-time-alarm text-white"></i>
                      </div>
                      <h4 className="text-warning">{estadoCAI.vencimiento}</h4>
                      <small className="text-muted">Fecha de Vencimiento</small>
                    </Col>
                    <Col md={3} sm={6} xs={12} className="text-center mb-3">
                      <div className="icon icon-shape bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: '50px', height: '50px'}}>
                        <i className="ni ni-single-copy-04 text-white"></i>
                      </div>
                      <h4 className="text-primary">{estadoCAI.emitidas}</h4>
                      <small className="text-muted">Facturas Emitidas</small>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              </Col></Row></Container>
    </>
  );
};

export default PanelFacturacion;
