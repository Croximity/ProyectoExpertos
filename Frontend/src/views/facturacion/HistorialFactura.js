import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Table,
  FormGroup,
  Label,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import HeaderResponsive from "components/Headers/HeaderResponsive.js";

// Datos simulados de facturas
const facturasSimuladas = [
  {
    factura: "F001",
    cliente: "Juan Pérez",
    fechaEmision: "2025-06-10",
    estado: "Pagada",
    total: 1500.0,
  },
  {
    factura: "F002",
    cliente: "María López",
    fechaEmision: "2025-06-18",
    estado: "Pendiente",
    total: 2300.5,
  },
  {
    factura: "F003",
    cliente: "Carlos Ramírez",
    fechaEmision: "2025-07-02",
    estado: "Pagada",
    total: 1200.75,
  },
  {
    factura: "F004",
    cliente: "Juan Pérez",
    fechaEmision: "2025-07-04",
    estado: "Cancelada",
    total: 800.0,
  },
  // Más datos simulados...
];

const ITEMS_PER_PAGE = 5;

const HistorialFactura = () => {
  const [filtros, setFiltros] = useState({ cliente: "", desde: "", hasta: "", estado: "" });
  const [facturas, setFacturas] = useState([]);
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    // Simular carga inicial de facturas
    setFacturas(facturasSimuladas);
  }, []);

  useEffect(() => {
    // Filtrar facturas según filtros
    let resultado = facturas;

    if (filtros.cliente.trim() !== "") {
      resultado = resultado.filter((f) =>
        f.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())
      );
    }
    if (filtros.desde) {
      resultado = resultado.filter((f) => f.fechaEmision >= filtros.desde);
    }
    if (filtros.hasta) {
      resultado = resultado.filter((f) => f.fechaEmision <= filtros.hasta);
    }
    if (filtros.estado) {
      resultado = resultado.filter((f) => f.estado === filtros.estado);
    }

    setFacturasFiltradas(resultado);
    setPaginaActual(1); // Reset página al cambiar filtros
  }, [filtros, facturas]);

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Paginación
  const totalPaginas = Math.ceil(facturasFiltradas.length / ITEMS_PER_PAGE);
  const facturasPagina = facturasFiltradas.slice(
    (paginaActual - 1) * ITEMS_PER_PAGE,
    paginaActual * ITEMS_PER_PAGE
  );

  const cambiarPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPaginaActual(num);
  };

  return (
    <>
      <HeaderResponsive />
      <Container className="mt-4">
        <Card>
          <CardBody>
            <Row form className="mb-3">
              <Col md={3}>
                <FormGroup>
                  <Label>Cliente</Label>
                  <Input
                    name="cliente"
                    placeholder="Buscar por cliente..."
                    value={filtros.cliente}
                    onChange={handleFiltro}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label>Desde</Label>
                  <Input
                    type="date"
                    name="desde"
                    value={filtros.desde}
                    onChange={handleFiltro}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label>Hasta</Label>
                  <Input
                    type="date"
                    name="hasta"
                    value={filtros.hasta}
                    onChange={handleFiltro}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label>Estado</Label>
                  <Input
                    type="select"
                    name="estado"
                    value={filtros.estado}
                    onChange={handleFiltro}
                  >
                    <option value="">Todos</option>
                    <option value="Pagada">Pagada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelada">Cancelada</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            {facturasFiltradas.length === 0 ? (
              <p className="text-center">No se encontraron facturas con esos filtros.</p>
            ) : (
              <>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Factura</th>
                      <th>Cliente</th>
                      <th>Fecha de Emisión</th>
                      <th>Estado</th>
                      <th>Total (L)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturasPagina.map((factura, idx) => (
                      <tr key={idx}>
                        <td>{factura.factura}</td>
                        <td>{factura.cliente}</td>
                        <td>{factura.fechaEmision}</td>
                        <td>{factura.estado}</td>
                        <td>{factura.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {totalPaginas > 1 && (
                  <Pagination aria-label="Paginación de facturas">
                    <PaginationItem disabled={paginaActual === 1}>
                      <PaginationLink first onClick={() => cambiarPagina(1)} />
                    </PaginationItem>
                    <PaginationItem disabled={paginaActual === 1}>
                      <PaginationLink
                        previous
                        onClick={() => cambiarPagina(paginaActual - 1)}
                      />
                    </PaginationItem>

                    {[...Array(totalPaginas)].map((_, i) => (
                      <PaginationItem active={paginaActual === i + 1} key={i}>
                        <PaginationLink onClick={() => cambiarPagina(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem disabled={paginaActual === totalPaginas}>
                      <PaginationLink
                        next
                        onClick={() => cambiarPagina(paginaActual + 1)}
                      />
                    </PaginationItem>
                    <PaginationItem disabled={paginaActual === totalPaginas}>
                      <PaginationLink last onClick={() => cambiarPagina(totalPaginas)} />
                    </PaginationItem>
                  </Pagination>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default HistorialFactura;
