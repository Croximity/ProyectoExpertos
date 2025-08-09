import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { productoService } from '../../services/productos/productoService';
import { categoriaProductoService } from '../../services/productos/categoriaProductoService';
import { useToast } from '../../hooks/useToast';
import Header from 'components/Headers/Header.js';
import Toast from 'components/Toast/Toast';
import axiosInstance from '../../utils/axiosConfig';

const ProductoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [producto, setProducto] = useState({ Nombre: '', idCategoriaProducto: '', impuesto: 0, marca: '', precioCosto: 0, precioVenta: 0, stockInicial: 0 });
  const [categorias, setCategorias] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [cacheBust, setCacheBust] = useState(0);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoriaProductoService.obtenerCategorias();
        setCategorias(data);
      } catch (error) {
        showError('Error al cargar las categorías');
      }
    };

    fetchCategorias();

    if (id) {
      const fetchProducto = async () => {
        try {
          const data = await productoService.obtenerProductoPorId(id);
          setProducto(data);
          setImgError(false);
          setCacheBust(Date.now());
        } catch (error) {
          showError('Error al cargar el producto');
        }
      };
      fetchProducto();
    }
  }, [id, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImgError(false);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await productoService.actualizarProducto(id, producto);
        if (imagen) {
          const resp = await productoService.actualizarImagenProducto(id, imagen);
          if (resp?.producto) {
            // Reconsultar para asegurar consistencia y bustear cache
            const actualizado = await productoService.obtenerProductoPorId(id);
            setProducto(actualizado);
            setPreviewUrl(null);
            setImgError(false);
            setCacheBust(Date.now());
          }
        }
        showSuccess('Producto actualizado exitosamente');
      } else {
        const creado = await productoService.crearProducto(producto, imagen);
        showSuccess('Producto creado exitosamente');
      }
      setTimeout(() => navigate('/admin/productos'), 1000);
    } catch (error) {
      showError('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const apiOrigin = new URL(axiosInstance.defaults.baseURL).origin;
  const baseImagen = producto?.imagenUrl || (producto?.imagen ? `${apiOrigin}/public/img/productos/${producto.imagen}` : null);
  const imagenExistente = baseImagen ? `${baseImagen}${baseImagen.includes('?') ? '&' : '?'}t=${cacheBust}` : null;

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader>
                <h3>{id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="Nombre">Nombre</Label>
                        <Input type="text" name="Nombre" id="Nombre" value={producto.Nombre} onChange={handleChange} required />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="idCategoriaProducto">Categoría</Label>
                        <Input type="select" name="idCategoriaProducto" id="idCategoriaProducto" value={producto.idCategoriaProducto} onChange={handleChange} required>
                          <option value="">Seleccione una categoría</option>
                          {categorias.map(c => (
                            <option key={c.idCategoriaProducto} value={c.idCategoriaProducto}>{c.Nombre}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="marca">Marca</Label>
                        <Input type="text" name="marca" id="marca" value={producto.marca} onChange={handleChange} />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="precioCosto">Precio Costo</Label>
                        <Input type="number" name="precioCosto" id="precioCosto" value={producto.precioCosto} onChange={handleChange} required />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="precioVenta">Precio Venta</Label>
                        <Input type="number" name="precioVenta" id="precioVenta" value={producto.precioVenta} onChange={handleChange} required />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="stockInicial">Stock</Label>
                        <Input type="number" name="stockInicial" id="stockInicial" value={producto.stockInicial} onChange={handleChange} required />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                        <FormGroup>
                            <Label for="impuesto">Impuesto (%)</Label>
                            <Input type="number" name="impuesto" id="impuesto" value={producto.impuesto} onChange={handleChange} />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="imagen">Imagen (Opcional)</Label>
                        <Input type="file" name="imagen" id="imagen" onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg" />
                        <div style={{ marginTop: 10 }}>
                          {previewUrl ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img src={previewUrl} alt="Previsualización" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #e9ecef' }} />
                              <span>Previsualización</span>
                            </div>
                          ) : imagenExistente && !imgError ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img key={imagenExistente} src={imagenExistente} alt={producto.Nombre} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #e9ecef' }} onError={() => setImgError(true)} />
                              <span>Imagen actual</span>
                            </div>
                          ) : (
                            <div style={{ width: 80, height: 80, borderRadius: 6, border: '1px dashed #adb5bd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', fontSize: 12 }}>
                              No hay imagen subida
                            </div>
                          )}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button type="submit" color="primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button color="secondary" onClick={() => navigate('/admin/productos')} disabled={loading}>Cancelar</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductoForm;
