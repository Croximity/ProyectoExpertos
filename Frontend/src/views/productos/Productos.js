import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { productoService } from '../../services/productos/productoService';
import { useToast } from '../../hooks/useToast';
import HeaderBlanco from 'components/Headers/HeaderBlanco.js';
import Toast from 'components/Toast/Toast';
import axiosInstance from '../../utils/axiosConfig';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [imageError, setImageError] = useState({});
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productoService.obtenerProductos();
        setProductos(data);
      } catch (error) {
        showError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [showError]);

  const toggleDropdown = (id) => {
    setDropdownOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleEdit = (id) => {
    navigate(`/admin/productos/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productoService.eliminarProducto(id);
        setProductos(productos.filter(p => p.idProducto !== id));
        showSuccess('Producto eliminado exitosamente');
      } catch (error) {
        showError('Error al eliminar el producto');
      }
    }
  };

  const apiOrigin = new URL(axiosInstance.defaults.baseURL).origin;
  const basePublic = `${apiOrigin}/public/img/productos`;

  const handleImgError = (id) => {
    setImageError(prev => ({ ...prev, [id]: true }));
  };

  return (
    <>
      <HeaderBlanco />
      <Container className="mt--7" fluid>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Gestión de Productos</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button color="primary" onClick={() => navigate('/admin/productos/nuevo')}>
                      Nuevo Producto
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Producto</th>
                      <th scope="col">Categoría</th>
                      <th scope="col">Marca</th>
                      <th scope="col">Precio Venta</th>
                      <th scope="col">Stock</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(producto => {
                      const hasUrl = !!producto.imagenUrl;
                      const fallbackUrl = producto.imagen ? `${basePublic}/${producto.imagen}` : null;
                      const imgSrc = hasUrl ? producto.imagenUrl : fallbackUrl;
                      const showFallback = !imgSrc || imageError[producto.idProducto];
                      return (
                        <tr key={producto.idProducto}>
                          <td>{producto.idProducto}</td>
                          <td>
                            {!showFallback ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <img
                                  src={imgSrc}
                                  alt={producto.Nombre}
                                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #e9ecef' }}
                                  onError={() => handleImgError(producto.idProducto)}
                                />
                                <span>{producto.Nombre}</span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 60, height: 60, borderRadius: 6, border: '1px dashed #adb5bd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', fontSize: 12 }}>
                                  No hay imagen subida
                                </div>
                                <span>{producto.Nombre}</span>
                              </div>
                            )}
                          </td>
                          <td>{producto.CategoriaProducto?.Nombre || 'N/A'}</td>
                          <td>{producto.marca}</td>
                          <td>{producto.precioVenta}</td>
                          <td>{producto.stockInicial}</td>
                          <td>
                            <Dropdown isOpen={dropdownOpen[producto.idProducto]} toggle={() => toggleDropdown(producto.idProducto)}>
                              <DropdownToggle>
                                <i className="fas fa-ellipsis-v" />
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={() => handleEdit(producto.idProducto)}>Editar</DropdownItem>
                                <DropdownItem onClick={() => handleDelete(producto.idProducto)}>Eliminar</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Productos;
