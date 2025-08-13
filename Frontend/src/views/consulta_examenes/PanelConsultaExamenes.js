import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
  Badge,
  Progress
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPrescription,
  faStethoscope,
  faVirus,
  faTools,
  faClipboardCheck,
  faEye,
  faChartLine,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';

// Importar los servicios para obtener estadísticas
import { recetaService } from '../../services/consulta_examenes/recetaService';
import { examenVistaService } from '../../services/consulta_examenes/examenVistaService';
import { diagnosticoService } from '../../services/consulta_examenes/diagnosticoService';
import { tipoEnfermedadService } from '../../services/consulta_examenes/tipoEnfermedadService';
import { reparacionLentesService } from '../../services/consulta_examenes/reparacionLentesService';

const PanelConsultaExamenes = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState({
    totalRecetas: 0,
    totalExamenes: 0,
    totalDiagnosticos: 0,
    totalTiposEnfermedad: 0,
    totalReparaciones: 0,
    totalConsultas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      
      // Cargar datos de todos los servicios en paralelo
      const [
        recetas,
        examenes,
        diagnosticos,
        tiposEnfermedad,
        reparaciones
      ] = await Promise.allSettled([
        recetaService.obtenerRecetas(),
        examenVistaService.obtenerExamenesVista(),
        diagnosticoService.obtenerDiagnosticos(),
        tipoEnfermedadService.obtenerTiposEnfermedad(),
        reparacionLentesService.obtenerReparaciones().catch(() => [])
      ]);

      setEstadisticas({
        totalRecetas: recetas.status === 'fulfilled' && Array.isArray(recetas.value) ? recetas.value.length : 0,
        totalExamenes: examenes.status === 'fulfilled' && Array.isArray(examenes.value) ? examenes.value.length : 0,
        totalDiagnosticos: diagnosticos.status === 'fulfilled' && Array.isArray(diagnosticos.value) ? diagnosticos.value.length : 0,
        totalTiposEnfermedad: tiposEnfermedad.status === 'fulfilled' && Array.isArray(tiposEnfermedad.value) ? tiposEnfermedad.value.length : 0,
        totalReparaciones: reparaciones.status === 'fulfilled' && Array.isArray(reparaciones.value) ? reparaciones.value.length : 0,
        totalConsultas: 0
      });

    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const modulosMenu = [
    {
      titulo: 'Consultas',
      descripcion: 'Gestión de consultas de clientes',
      icono: faCalendarAlt,
      color: 'default',
      ruta: '/admin/consulta-examenes/consultas',
      total: estadisticas.totalConsultas
    },
    {
      titulo: 'Recetas Médicas',
      descripcion: 'Gestión de recetas médicas, prescripciones y graduaciones',
      icono: faPrescription,
      color: 'primary',
      ruta: '/admin/consulta-examenes/recetas',
      total: estadisticas.totalRecetas
    },
    {
      titulo: 'Exámenes de Vista',
      descripcion: 'Registro y seguimiento de exámenes oftalmológicos',
      icono: faStethoscope,
      color: 'success',
      ruta: '/admin/consulta-examenes/examenes-vista',
      total: estadisticas.totalExamenes
    },
    {
      titulo: 'Diagnósticos',
      descripcion: 'Gestión de diagnósticos médicos y resultados',
      icono: faClipboardCheck,
      color: 'info',
      ruta: '/admin/consulta-examenes/diagnosticos',
      total: estadisticas.totalDiagnosticos
    },
    {
      titulo: 'Tipos de Enfermedad',
      descripcion: 'Catálogo de tipos de enfermedades oftalmológicas',
      icono: faVirus,
      color: 'warning',
      ruta: '/admin/consulta-examenes/tipos-enfermedad',
      total: estadisticas.totalTiposEnfermedad
    },
    {
      titulo: 'Reparación de Lentes',
      descripcion: 'Gestión de reparaciones y mantenimiento de lentes',
      icono: faTools,
      color: 'danger',
      ruta: '/admin/consulta-examenes/reparacion-lentes',
      total: estadisticas.totalReparaciones
    }
  ];

  const handleNavegar = (ruta) => {
    navigate(ruta);
  };

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
      <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                    <h5 className="h3 mb-0">
                      Panel de Control de Consulta de Exámenes
                    </h5>
                    <p className="text-muted mb-0 mt-2">
                    Gestiona recetas, exámenes, diagnósticos, tipos de enfermedad y reparaciones de lentes
                    </p>
                  </Col>
                </Row>
              </CardHeader>
            </Card>
            

        {/* Resumen de estadísticas */}
        <Row className="mb-4">
          <Col lg="3" md="6">
            <Card className="card-stats mb-4 mb-lg-0 shadow">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="icon-shape bg-danger text-white rounded-circle shadow" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <FontAwesomeIcon icon={faEye} size="sm" />
                    </div>
                  </Col>
                  <Col xs="7 p-2">
                    <div className="numbers">
                      <p className="card-category text-uppercase text-muted mb-0 font-weight-bold">
                        Total Registros
                      </p>
                      <h2 className="card-title text-default">
                        {Object.values(estadisticas).reduce((a, b) => a + b, 0)}
                      </h2>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          
          <Col lg="3" md="6">
            <Card className="card-stats mb-4 mb-lg-0 shadow">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="icon-shape bg-warning text-white rounded-circle shadow" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <FontAwesomeIcon icon={faPrescription} size="sm" />
                    </div>
                  </Col>
                  <Col xs="7 p-2">
                    <div className="numbers">
                      <p className="card-category text-uppercase text-muted mb-0 font-weight-bold">
                        Recetas
                      </p>
                      <h2 className="card-title text-default">
                        {estadisticas.totalRecetas}
                      </h2>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col lg="3" md="6">
            <Card className="card-stats mb-4 mb-lg-0 shadow">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="icon-shape bg-success text-white rounded-circle shadow" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <FontAwesomeIcon icon={faStethoscope} size="sm" />
                    </div>
                  </Col>
                  <Col xs="7 p-2">
                    <div className="numbers">
                      <p className="card-category text-uppercase text-muted mb-0 font-weight-bold">
                        Exámenes
                      </p>
                      <h2 className="card-title text-default">
                        {estadisticas.totalExamenes}
                      </h2>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col lg="3" md="6">
            <Card className="card-stats mb-4 mb-lg-0 shadow">
              <CardBody>
                <Row>
                <Col xs="4">
                     <div className="icon-shape bg-info text-white rounded-circle shadow" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                       <FontAwesomeIcon icon={faClipboardCheck} size="sm" />
                     </div>
                   </Col>
                   <Col xs="8 p-2">
                     <div className="numbers">
                       <p className="card-category text-uppercase text-muted mb-0 font-weight-bold">
                         Diagnósticos
                       </p>
                       <h2 className="card-title text-default">
                         {estadisticas.totalDiagnosticos}
                       </h2>
                     </div>
                   </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Módulos principales */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Módulos de Consulta de Exámenes
                </h3>
              </CardHeader>
              <CardBody>
                <Row>
                  {modulosMenu.map((modulo, index) => (
                    <Col lg="4" md="6" key={index} className="mb-4">
                      <Card className="border-0 h-100 hover-shadow-lg transition-all">
                        <CardBody className="text-center">
                          <div className={`icon-shape bg-gradient-${modulo.color} text-white rounded-circle shadow mx-auto mb-3`} style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={modulo.icono} size="lg" />
                          </div>
                          
                          <h5 className="text-primary font-weight-bold">
                            {modulo.titulo}
                          </h5>
                          
                          <p className="text-muted mb-3">
                            {modulo.descripcion}
                          </p>

                          <div className="mb-3">
                            <Badge color={modulo.color} pill className="p-2">
                              {modulo.total} registros
                            </Badge>
                          </div>

                          <Button
                            color={modulo.color}
                            className="btn-round"
                            onClick={() => handleNavegar(modulo.ruta)}
                          >
                            Gestionar
                            <FontAwesomeIcon icon={modulo.icono} className="ml-2" />
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </Container>
    </>
  );
};

export default PanelConsultaExamenes;
