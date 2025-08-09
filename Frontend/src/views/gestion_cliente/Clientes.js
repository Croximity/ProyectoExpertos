import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
} from "reactstrap";

// Header del dashboard
import Header from "components/Headers/Header.js";
import { useNavigate } from 'react-router-dom';
import { clienteService } from '../../services/gestion_cliente/clienteService';
import { useToast } from '../../hooks/useToast';

const Clientes = () => {
  const navigate = useNavigate();
  const { showError, showSuccess, hideToast, toast } = useToast();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await clienteService.obtenerClientes();
        setClientes(data);
      } catch (_) {
        showError('Error al cargar clientes');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [showError]);

  const handleEditar = (id) => {
    navigate(`/admin/clientes/editar/${id}`);
  };

  const handleBuscar = async () => {
    try {
      setLoading(true);
      const filtros = {};
      if (searchTerm) {
        const parts = searchTerm.trim().split(' ');
        if (parts.length >= 2) {
          filtros.Pnombre = parts[0];
          filtros.Papellido = parts.slice(1).join(' ');
        } else {
          filtros.Pnombre = searchTerm.trim();
        }
      }
      const data = await clienteService.obtenerClientes(filtros);
      setClientes(data);
    } catch (_) {
      showError('Error al buscar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await clienteService.eliminarCliente(id);
      setClientes(prev => prev.filter(c => c.idCliente !== id));
      showSuccess('Cliente eliminado');
    } catch (_) {
      showError('Error al eliminar el cliente');
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        {/* Toast opcional si se usa componente */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Gestión de Clientes</h3>
                <Button color="success" size="sm" onClick={() => navigate('/admin/clientes/nuevo')}>
                  Registrar Cliente
                </Button>
              </CardHeader>
              <CardBody>
                <div className="d-flex gap-2 mb-3" style={{ gap: 8 }}>
                  <input
                    className="form-control"
                    placeholder="Buscar por nombre y/o apellido"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                    style={{ maxWidth: 360 }}
                  />
                  <Button color="primary" onClick={handleBuscar}>Buscar</Button>
                </div>
                {loading ? (
                  <div>Cargando...</div>
                ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>ID</th>
                      <th>Nombre Completo</th>
                      <th>DNI</th>
                      <th>Correo</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((cliente) => (
                      <tr key={cliente.idCliente}>
                        <td>{cliente.idCliente}</td>
                        <td>{cliente.persona ? `${cliente.persona.Pnombre} ${cliente.persona.Papellido}` : '—'}</td>
                        <td>{cliente.persona?.DNI || '—'}</td>
                        <td>{cliente.persona?.correo || '—'}</td>
                        <td>{cliente.fechaRegistro ? new Date(cliente.fechaRegistro).toLocaleDateString() : '—'}</td>
                        <td>
                          <Button color="info" size="sm" className="mr-2" onClick={() => handleEditar(cliente.idCliente)}>
                            Editar
                          </Button>
                          <Button color="danger" size="sm" onClick={() => handleEliminar(cliente.idCliente)}>
                            Eliminar
                          </Button>
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

export default Clientes;
