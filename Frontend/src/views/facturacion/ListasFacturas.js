// views/Facturas/ListaFacturas.js  
import React, { useState, useEffect } from 'react';  
import {  
  Card,  
  CardHeader,  
  CardBody,  
  Table,  
  Container,  
  Row,  
  Col,  
  Button,  
  Badge,  
  Input,  
  InputGroup,  
  InputGroupAddon,  
  InputGroupText  
} from 'reactstrap';  
import Header from 'components/Headers/Header.js';  
import { facturaService } from 'services/facturacion/facturaService.js';  
  
const ListaFacturas = () => {  
  const [facturas, setFacturas] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [filtro, setFiltro] = useState('');  
  const [error, setError] = useState(null);  
  
  useEffect(() => {  
    cargarFacturas();  
  }, []);  
  
  const cargarFacturas = async () => {  
    try {  
      setLoading(true);  
      const response = await facturaService.obtenerFacturas();  
      setFacturas(response.facturas || []);  
      setError(null);  
    } catch (error) {  
      console.error('Error al cargar facturas:', error);  
      setError('Error al cargar las facturas');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleDescargarPDF = (idFactura) => {  
    facturaService.descargarPDF(idFactura);  
  };  
  
  const facturasFiltradas = facturas.filter(factura =>  
    factura.idFactura.toString().includes(filtro) ||  
    (factura.Cliente?.nombre || '').toLowerCase().includes(filtro.toLowerCase()) ||  
    factura.estadoFactura.toLowerCase().includes(filtro.toLowerCase())  
  );  
  
  const formatearFecha = (fecha) => {  
    return new Date(fecha).toLocaleDateString('es-HN');  
  };  
  
  const formatearMoneda = (monto) => {  
    return `L. ${parseFloat(monto).toFixed(2)}`;  
  };  
  
  const getBadgeColor = (estado) => {  
    return estado === 'activa' ? 'success' : 'danger';  
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
                  <Col xs="8">  
                    <h3 className="mb-0">Lista de Facturas</h3>  
                  </Col>  
                  <Col xs="4" className="text-right">  
                    <Button  
                      color="primary"  
                      href="/admin/crear-factura"  
                      size="sm"  
                    >  
                      Nueva Factura  
                    </Button>  
                  </Col>  
                </Row>  
                <Row className="mt-3">  
                  <Col md="6">  
                    <InputGroup>  
                      <InputGroupAddon addonType="prepend">  
                        <InputGroupText>  
                          <i className="fas fa-search" />  
                        </InputGroupText>  
                      </InputGroupAddon>  
                      <Input  
                        placeholder="Buscar por número, cliente o estado..."  
                        type="text"  
                        value={filtro}  
                        onChange={(e) => setFiltro(e.target.value)}  
                      />  
                    </InputGroup>  
                  </Col>  
                  <Col md="6" className="text-right">  
                    <Button  
                      color="secondary"  
                      size="sm"  
                      onClick={cargarFacturas}  
                    >  
                      <i className="fas fa-sync" /> Actualizar  
                    </Button>  
                  </Col>  
                </Row>  
              </CardHeader>  
              <CardBody>  
                {loading ? (  
                  <div className="text-center py-4">  
                    <i className="fas fa-spinner fa-spin fa-2x text-primary" />  
                    <p className="mt-2">Cargando facturas...</p>  
                  </div>  
                ) : error ? (  
                  <div className="text-center py-4">  
                    <i className="fas fa-exclamation-triangle fa-2x text-warning" />  
                    <p className="mt-2 text-warning">{error}</p>  
                    <Button color="primary" size="sm" onClick={cargarFacturas}>  
                      Reintentar  
                    </Button>  
                  </div>  
                ) : facturasFiltradas.length === 0 ? (  
                  <div className="text-center py-4">  
                    <i className="fas fa-file-invoice fa-2x text-muted" />  
                    <p className="mt-2 text-muted">  
                      {filtro ? 'No se encontraron facturas con ese criterio' : 'No hay facturas registradas'}  
                    </p>  
                  </div>  
                ) : (  
                  <Table className="align-items-center table-flush" responsive>  
                    <thead className="thead-light">  
                      <tr>  
                        <th scope="col">No. Factura</th>  
                        <th scope="col">Fecha</th>  
                        <th scope="col">Cliente</th>  
                        <th scope="col">Total</th>  
                        <th scope="col">Estado</th>  
                        <th scope="col">Acciones</th>  
                      </tr>  
                    </thead>  
                    <tbody>  
                      {facturasFiltradas.map((factura) => (  
                        <tr key={factura.idFactura}>  
                          <td>  
                            <span className="mb-0 text-sm font-weight-bold">  
                              {factura.idFactura.toString().padStart(8, '0')}  
                            </span>  
                          </td>  
                          <td>  
                            <span className="mb-0 text-sm">  
                              {formatearFecha(factura.Fecha)}  
                            </span>  
                          </td>  
                          <td>  
                            <span className="mb-0 text-sm">  
                              {factura.Cliente?.nombre || 'Cliente no disponible'}  
                            </span>  
                          </td>  
                          <td>  
                            <span className="mb-0 text-sm font-weight-bold">  
                              {formatearMoneda(factura.Total_Facturado)}  
                            </span>  
                          </td>  
                          <td>  
                            <Badge  
                              color={getBadgeColor(factura.estadoFactura)}  
                              pill  
                            >  
                              {factura.estadoFactura}  
                            </Badge>  
                          </td>  
                          <td>  
                            <Button  
                              color="info"  
                              size="sm"  
                              onClick={() => handleDescargarPDF(factura.idFactura)}  
                              disabled={!factura.archivo_pdf}  
                            >  
                              <i className="fas fa-download" /> PDF  
                            </Button>  
                            {factura.estadoFactura === 'activa' && (  
                              <Button  
                                color="warning"  
                                size="sm"  
                                className="ml-2"  
                                onClick={() => {  
                                  // Implementar anulación de factura  
                                  console.log('Anular factura:', factura.idFactura);  
                                }}  
                              >  
                                <i className="fas fa-ban" /> Anular  
                              </Button>  
                            )}  
                          </td>  
                        </tr>  
                      ))}  
                    </tbody>  
                  </Table>  
                )}  
              </CardBody>  
            </Card>  
          </Col>  
        </Row>  
      </Container>  
    </>  
  );  
};  
  
export default ListaFacturas;