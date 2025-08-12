import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from "reactstrap";
import jsPDF from "jspdf";
import HeaderResponsive from "components/Headers/HeaderResponsive";

// Datos simulados: facturas pendientes para pago
const facturasSimuladas = [
  { id: 1, numero: "F001", cliente: "Juan Pérez", total: 1500.0, saldo: 500.0 },
  { id: 2, numero: "F002", cliente: "María López", total: 2300.5, saldo: 2300.5 },
  { id: 3, numero: "F003", cliente: "Carlos Ramírez", total: 1200.75, saldo: 0 }, // pagada
];

const formasPago = [
  "Efectivo",
  "Tarjeta de Crédito",
  "Transferencia Bancaria",
  "Cheque",
  "Otro",
];

const RegistrarPago = () => {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [pagosRegistrados, setPagosRegistrados] = useState([]);

  // Cuando se selecciona factura, resetear campos de pago
  useEffect(() => {
    setMontoPago("");
    setFormaPago("");
    setFechaPago(new Date().toISOString().split("T")[0]); // hoy
  }, [facturaSeleccionada]);

  const handleRegistrarPago = () => {
    if (!facturaSeleccionada) {
      alert("Seleccione una factura para registrar el pago.");
      return;
    }
    if (!montoPago || parseFloat(montoPago) <= 0) {
      alert("Ingrese un monto válido para el pago.");
      return;
    }
    if (parseFloat(montoPago) > facturaSeleccionada.saldo) {
      alert(`El monto no puede ser mayor al saldo pendiente: L ${facturaSeleccionada.saldo.toFixed(2)}`);
      return;
    }
    if (!formaPago) {
      alert("Seleccione una forma de pago.");
      return;
    }
    if (!fechaPago) {
      alert("Seleccione la fecha del pago.");
      return;
    }

    // Registrar pago (simulado)
    const nuevoPago = {
      id: pagosRegistrados.length + 1,
      factura: facturaSeleccionada.numero,
      cliente: facturaSeleccionada.cliente,
      monto: parseFloat(montoPago),
      formaPago,
      fechaPago,
    };

    setPagosRegistrados([...pagosRegistrados, nuevoPago]);

    // Actualizar saldo local (simulado)
    setFacturaSeleccionada({
      ...facturaSeleccionada,
      saldo: facturaSeleccionada.saldo - parseFloat(montoPago),
    });

    alert("Pago registrado con éxito.");
    setMontoPago("");
    setFormaPago("");
    // Mantener fecha actual o resetear si prefieres
  };

  // Generar recibo PDF simple (simulado)
  const generarReciboPDF = (pago) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Recibo de Pago - Óptica Velásquez", 14, 20);

    doc.setFontSize(12);
    doc.text(`Factura: ${pago.factura}`, 14, 30);
    doc.text(`Cliente: ${pago.cliente}`, 14, 40);
    doc.text(`Monto: L ${pago.monto.toFixed(2)}`, 14, 50);
    doc.text(`Forma de Pago: ${pago.formaPago}`, 14, 60);
    doc.text(`Fecha: ${pago.fechaPago}`, 14, 70);

    doc.save(`recibo-${pago.factura}-${pago.id}.pdf`);
  };

  return (
    <>
      <HeaderResponsive />
      <Container className="mt-4">
        <Card>
          <CardBody>
            <h4>Registrar Pago</h4>

            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label>Seleccionar Factura</Label>
                  <Input
                    type="select"
                    value={facturaSeleccionada ? facturaSeleccionada.id : ""}
                    onChange={(e) => {
                      const factura = facturasSimuladas.find(
                        (f) => f.id === parseInt(e.target.value)
                      );
                      setFacturaSeleccionada(factura || null);
                    }}
                  >
                    <option value="">Seleccione una factura</option>
                    {facturasSimuladas
                      .filter((f) => f.saldo > 0) // Solo facturas con saldo pendiente
                      .map((factura) => (
                        <option key={factura.id} value={factura.id}>
                          {factura.numero} - {factura.cliente} (Saldo: L{" "}
                          {factura.saldo.toFixed(2)})
                        </option>
                      ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            {facturaSeleccionada && (
              <div className="alert alert-info">
                <strong>Factura seleccionada:</strong> {facturaSeleccionada.numero} -{" "}
                {facturaSeleccionada.cliente}
                <br />
                <strong>Total:</strong> L {facturaSeleccionada.total.toFixed(2)} |{" "}
                <strong>Saldo pendiente:</strong> L{" "}
                {facturaSeleccionada.saldo.toFixed(2)}
              </div>
            )}

            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label>Monto a pagar (L)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={facturaSeleccionada ? facturaSeleccionada.saldo : 0}
                    placeholder="Ingrese monto"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    disabled={!facturaSeleccionada}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label>Forma de pago</Label>
                  <Input
                    type="select"
                    value={formaPago}
                    onChange={(e) => setFormaPago(e.target.value)}
                    disabled={!facturaSeleccionada}
                  >
                    <option value="">Seleccione forma de pago</option>
                    {formasPago.map((forma, idx) => (
                      <option key={idx} value={forma}>
                        {forma}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Fecha de pago</Label>
                  <Input
                    type="date"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                    disabled={!facturaSeleccionada}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Button
              color="primary"
              onClick={handleRegistrarPago}
              disabled={!facturaSeleccionada}
            >
              Registrar Pago
            </Button>

            <hr />

            <h5>Pagos registrados</h5>
            {pagosRegistrados.length === 0 ? (
              <p>No hay pagos registrados aún.</p>
            ) : (
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Factura</th>
                    <th>Cliente</th>
                    <th>Monto (L)</th>
                    <th>Forma de Pago</th>
                    <th>Fecha</th>
                    <th>Recibo</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosRegistrados.map((pago) => (
                    <tr key={pago.id}>
                      <td>{pago.id}</td>
                      <td>{pago.factura}</td>
                      <td>{pago.cliente}</td>
                      <td>{pago.monto.toFixed(2)}</td>
                      <td>{pago.formaPago}</td>
                      <td>{pago.fechaPago}</td>
                      <td>
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => generarReciboPDF(pago)}
                        >
                          Descargar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default RegistrarPago;
