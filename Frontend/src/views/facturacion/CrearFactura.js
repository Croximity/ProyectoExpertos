import React, { useState } from "react";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Label,
  Input,
  Button,
  Table,
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import jsPDF from "jspdf";
import HeaderResponsive from "components/Headers/HeaderResponsive";
import logo from "../../../src/assets/img/brand/logoOptica.png"; // Importación directa
const clientesSimulados = [
  {
    id: 1,
    nombre: "MASS PUBLICIDAD S DE RL",
    email: "masspublicidad@email.com",
    nit: "08019995317907",
  },
  {
    id: 2,
    nombre: "JUAN PÉREZ",
    email: "juan@email.com",
    nit: "08011985123456",
  },
];

const CrearFactura = () => {
  const [cliente, setCliente] = useState(null);
  const [dropdownOpenCliente, setDropdownOpenCliente] = useState(false);
  const toggleCliente = () => setDropdownOpenCliente(!dropdownOpenCliente);

  const [producto, setProducto] = useState({
    nombre: "",
    precio: 0,
    cantidad: 1,
  });

  const [productos, setProductos] = useState([]);
  const [numeroFactura, setNumeroFactura] = useState("02312");
  const [fechaEmision, setFechaEmision] = useState("2025-05-01");

  const subtotal = productos.reduce(
    (s, p) => s + p.precio * p.cantidad,
    0
  );
  const impuestos = subtotal * 0.15;
  const total = subtotal + impuestos;

  const agregarProducto = () => {
    if (!producto.nombre || producto.precio <= 0 || producto.cantidad <= 0) {
      alert("Ingrese un nombre, precio y cantidad válidos.");
      return;
    }
    setProductos([...productos, producto]);
    setProducto({ nombre: "", precio: 0, cantidad: 1 });
  };

  const generarPDF = () => {
  if (!cliente) {
    alert("Seleccione un cliente antes de generar el PDF.");
    return;
  }
  if (!numeroFactura) {
    alert("Ingrese el número de factura.");
    return;
  }

  const doc = new jsPDF();

  // Logo
  doc.addImage(logo, "PNG", 10, 10, 30, 30);

  // Encabezado
  doc.setFontSize(14);
  doc.text("TELEVISIÓN COMAYAGUA - CANAL 40", 45, 15);
  doc.setFontSize(10);
  doc.text("COLONIA SAN MIGUEL N°2, BOULEVARD DEL SUR", 45, 20);
  doc.text("CONTIGUO A RESTAURANTE LO DE KERPO, COMAYAGUA, HONDURAS", 45, 24);
  doc.text("Tel: 2772-7427 / 2770-6810  Fax: 2772-6810", 45, 28);
  doc.text("Cel: 9957-4580  RTN: 12171961001526", 45, 32);
  doc.text("E-mail: televisioncomayagua@yahoo.com", 45, 36);

  // Factura info
  doc.setFontSize(12);
  doc.text(`Factura No: 000-001-01-000-${numeroFactura}`, 14, 48);
  doc.text(`CAI: 254F8-612F1-8A0E0-6E8B3-0099B876`, 14, 54);
  doc.text(`Fecha de Emisión: ${fechaEmision}`, 14, 60);

  // Cliente
  doc.text(`Cliente: ${cliente.nombre}`, 14, 70);
  doc.text(`RTN: ${cliente.nit}`, 14, 76);
  doc.text("Nombre Comercial: _______________________", 14, 82);
  doc.text("Período de Facturación: __________________", 14, 88);

  // Tabla
  let y = 100;
  doc.setFontSize(11);
  doc.text("Cantidad", 14, y);
  doc.text("Descripción", 40, y);
  doc.text("P. Unitario", 150, y);
  doc.text("Total", 180, y);

  y += 6;
  productos.forEach((prod, idx) => {
    doc.text(`${prod.cantidad}`, 14, y);
    doc.text(`${prod.nombre}`, 40, y, { maxWidth: 105 });
    doc.text(`L ${prod.precio.toFixed(2)}`, 150, y);
    doc.text(`L ${(prod.precio * prod.cantidad).toFixed(2)}`, 180, y);
    y += 8;
  });

  // Totales
  y += 10;
  doc.text(`Subtotal: L ${subtotal.toFixed(2)}`, 150, y);
  y += 6;
  doc.text(`15% ISV: L ${impuestos.toFixed(2)}`, 150, y);
  y += 6;
  doc.setFontSize(12);
  doc.text(`TOTAL: L ${total.toFixed(2)}`, 150, y);

  // En letras
  y += 10;
  doc.setFontSize(10);
  doc.text("Cantidad en letras: ________________________________", 14, y);

  doc.save(`factura_${numeroFactura}.pdf`);
};

  const enviarCorreo = () => {
    if (!cliente) {
      alert("Seleccione un cliente para enviar la factura.");
      return;
    }
    alert(`Factura enviada al correo: ${cliente.email}`);
  };

  return (
    <>
      <HeaderResponsive />
      <Container className="mt-4">
        <Card>
          
          <CardBody>
            <Row className="mb-3">
              <Col md={3}>
                <Label>Número de Factura</Label>
                <Input
                  value={numeroFactura}
                  disabled
                />
              </Col>
              <Col md={3}>
                <Label>Fecha de emisión</Label>
                <Input
                  type="date"
                  value={fechaEmision}
                  disabled
                />
              </Col>


            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Label>Cliente</Label>
                <InputGroup>
                  <Input
                    readOnly
                    placeholder={
                      cliente ? cliente.nombre : "Seleccione un cliente"
                    }
                  />
                  <Dropdown isOpen={dropdownOpenCliente} toggle={toggleCliente}>
                    <DropdownToggle caret color="primary" />
                    <DropdownMenu>
                      {clientesSimulados.map((c) => (
                        <DropdownItem
                          key={c.id}
                          onClick={() => setCliente(c)}
                        >
                          {c.nombre}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </InputGroup>
              </Col>
           </Row>            

            <Row className="mb-3">
              <Col md={6}>
                <Label>Servicio</Label>
                <Input
                  placeholder="Descripción del servicio"
                  value={producto.nombre}
                  onChange={(e) =>
                    setProducto({ ...producto, nombre: e.target.value })
                  }
                />
              </Col>
              <Col md={2}>
                <Label>Precio (L)</Label>
                <Input
                  type="number"
                  value={producto.precio}
                  onChange={(e) =>
                    setProducto({ ...producto, precio: parseFloat(e.target.value) })
                  }
                />
              </Col>
              <Col md={2}>
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) =>
                    setProducto({ ...producto, cantidad: parseInt(e.target.value) })
                  }
                />
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button color="primary" onClick={agregarProducto} block>
                  Agregar Servicio
                </Button>
              </Col>
            </Row>

            <Table striped responsive>
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario (L)</th>
                  <th>Total (L)</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.nombre}</td>
                    <td>{p.cantidad}</td>
                    <td>{p.precio.toFixed(2)}</td>
                    <td>{(p.precio * p.cantidad).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <hr />
            <p>Subtotal: L {subtotal.toFixed(2)}</p>
            <p>ISV (15%): L {impuestos.toFixed(2)}</p>
            <p>
              <strong>Total: L {total.toFixed(2)}</strong>
            </p>

            <Row className="mt-4">
              <Col md={3}>
                <Button color="success" onClick={generarPDF} block>
                  Generar Factura 
                </Button>
              </Col>
              <Col md={3}>
                <Button color="info" onClick={enviarCorreo} block>
                  Enviar por correo
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default CrearFactura;
