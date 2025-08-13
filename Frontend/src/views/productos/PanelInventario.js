import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import HeaderBlanco from '../../components/Headers/HeaderBlanco';

const PanelInventario = () => {
  const navigate = useNavigate();

  const modulosInventario = [
    {
      titulo: 'Gestión de Productos',
      descripcion: 'Administrar productos del inventario, agregar, editar y eliminar productos',
      icono: 'ni ni-shop',
      color: 'primary',
      ruta: '/admin/productos',
      botones: [
        {
          texto: 'Ver Productos',
          color: 'primary',
          ruta: '/admin/productos'
        },
        {
          texto: 'Nuevo Producto',
          color: 'success',
          ruta: '/admin/productos/nuevo'
        }
      ]
    },
    {
      titulo: 'Categorías de Productos',
      descripcion: 'Gestionar categorías para organizar y clasificar los productos del inventario',
      icono: 'ni ni-tag',
      color: 'warning',
      ruta: '/admin/categorias',
      botones: [
        {
          texto: 'Ver Categorías',
          color: 'warning',
          ruta: '/admin/categorias'
        },
        {
          texto: 'Nueva Categoría',
          color: 'success',
          ruta: '/admin/categorias/nueva'
        }
      ]
    }
    
  ];

  const handleNavegacion = (ruta) => {
    if (ruta !== '#') {
      navigate(ruta);
    }
  };

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                    <h5 className="h3 mb-0">
                      Panel de Control de Productos
                    </h5>
                    <p className="text-muted mb-0 mt-2">
                    Gestiona productos y categorías de producto
                    </p>
                  </Col>
                </Row>
              </CardHeader>
            </Card>
            <Card className="shadow mb-4">
              <CardBody>
              <Row>
                   {modulosInventario.map((modulo, index) => (
                     <Col key={index} lg={6} className="mb-4">
                       <Card className="shadow h-100">
                         <CardBody className="text-center p-4 d-flex flex-column ">
                           <div>
                             <div className={`icon icon-shape bg-gradient-${modulo.color} rounded-circle mb-3 d-flex align-items-center justify-content-center mx-auto`} style={{width: '80px', height: '80px'}}>
                               <i className={`${modulo.icono} text-white`} style={{fontSize: '2rem'}}></i>
                             </div>
                             <h4 className="mb-3">{modulo.titulo}</h4>
                             <p className="text-muted mb-4">
                               {modulo.descripcion}
                             </p>
                           </div>
                           <div className="d-flex flex-column gap-2 align-items-center justify-content-center">
                             {modulo.botones.map((boton, botonIndex) => (
                               <Button
                                 key={botonIndex}
                                 color={boton.color}
                                 className="w-65 mb-2"
                                 onClick={() => handleNavegacion(boton.ruta)}
                                 disabled={boton.ruta === '#'}
                               >
                                 {boton.texto}
                               </Button>
                             ))}
                           </div>
                         </CardBody>
                       </Card>
                     </Col>
                   ))}
                 </Row>

                {/* Estadísticas Rápidas */}
                <Row className="mt-5">
                  <Col>
                    <Card className="shadow bg-gradient-primary">
                      <CardBody className="text-white">
                        <Row className="align-items-center">
                          <Col>
                            <h6 className="text-uppercase text-white-50 ls-1 mb-1">
                              Resumen Rápido
                            </h6>
                            <h3 className="mb-0 text-white">Vista General del Inventario</h3>
                          </Col>
                          <Col className="text-right">
                            <Button
                              color="white"
                              outline
                              onClick={() => navigate('/admin/productos')}
                            >
                              <i className="ni ni-chart-bar-32 mr-2"></i>
                              Ver Detalles
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                {/* Accesos Directos Adicionales */}
                <Row className="mt-4 ">
                  <Col md={4}>
                    <Card 
                      className="shadow bg-gradient-success text-white" 
                      onClick={() => navigate('/admin/productos')}
                      style={{cursor: 'pointer'}}
                    >
                      <CardBody className="text-center text-white p-3">
                        <i className="ni ni-shop text-white" style={{fontSize: '2rem'}}></i>
                        <h5 className="mt-2 mb-0 text-white">Productos</h5>
                        <small className="text-white">Gestión completa</small>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card 
                      className="shadow bg-gradient-warning text-white"
                      onClick={() => navigate('/admin/categorias')}
                      style={{cursor: 'pointer'}}
                    >
                      <CardBody className="text-center p-3">
                        <i className="ni ni-tag text-white" style={{fontSize: '2rem'}}></i>
                        <h5 className="mt-2 mb-0 text-white">Categorías</h5>
                        <small className="text-white">Organización</small>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card 
                      className="shadow bg-gradient-info text-white"
                      onClick={() => navigate('/admin/productos')}
                      style={{cursor: 'pointer'}}
                    >
                      <CardBody className="text-center p-3">
                        <i className="ni ni-chart-bar-32 text-white" style={{fontSize: '2rem'}}></i>
                        <h5 className="mt-2 mb-0 text-white">Reportes</h5>
                        <small className="text-white">Análisis</small>
                      </CardBody>
                    </Card>
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

export default PanelInventario;
