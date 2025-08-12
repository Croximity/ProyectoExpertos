import React, { useState, useEffect, useCallback } from "react";
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
  Alert,
  Spinner,
} from "reactstrap";
import jsPDF from "jspdf";
import HeaderBlanco from "components/Headers/HeaderBlanco.js";
import { facturaService } from "services/facturacion/facturaService";
import { formaPagoService } from "services/facturacion/formaPagoService";
import { pagoService } from "services/facturacion/pagoService";
import Toast from "components/Toast/Toast";

const RegistrarPago = () => {
  const [facturas, setFacturas] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [pagosRegistrados, setPagosRegistrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFacturas, setLoadingFacturas] = useState(true);
  const [loadingFormasPago, setLoadingFormasPago] = useState(true);
  const [saldoPendiente, setSaldoPendiente] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const cargarDatosIniciales = async () => {
    try {
      setLoadingFacturas(true);
      setLoadingFormasPago(true);

      // Cargar facturas
      const facturasResponse = await facturaService.obtenerFacturas();
      const facturasConSaldo = facturasResponse.facturas.map(factura => ({
        ...factura,
        saldoPendiente: factura.Total_Facturado // Inicialmente el saldo es el total
      }));
      setFacturas(facturasConSaldo);

      // Cargar formas de pago
      const formasPagoResponse = await formaPagoService.obtenerFormasPago();
      setFormasPago(formasPagoResponse.formas || formasPagoResponse);

      // Cargar pagos existentes
      const pagosResponse = await pagoService.obtenerPagos();
      setPagosRegistrados(pagosResponse.pagos || pagosResponse);

    } catch (error) {
      console.error("Error al cargar datos:", error);
      mostrarToast("Error al cargar los datos", "error");
    } finally {
      setLoadingFacturas(false);
      setLoadingFormasPago(false);
    }
  };

  const calcularSaldoPendiente = useCallback(async () => {
    if (!facturaSeleccionada) return;

    try {
      console.log('Calculando saldo para factura:', facturaSeleccionada.idFactura);
      console.log('Total facturado:', facturaSeleccionada.Total_Facturado);
      
      // Obtener pagos de la factura seleccionada
      const pagosResponse = await pagoService.obtenerPagosPorFactura(facturaSeleccionada.idFactura);
      const pagosFactura = pagosResponse.pagos || pagosResponse;
      
      console.log('Pagos encontrados:', pagosFactura);
      
      // Calcular total pagado
      const totalPagado = pagosFactura.reduce((sum, pago) => {
        return pago.estado === 'activo' ? sum + pago.monto : sum;
      }, 0);

      console.log('Total pagado:', totalPagado);

      // Calcular saldo pendiente
      const saldo = facturaSeleccionada.Total_Facturado - totalPagado;
      const saldoFinal = saldo > 0 ? saldo : 0;
      
      console.log('Saldo calculado:', saldo, 'Saldo final:', saldoFinal);
      
      setSaldoPendiente(saldoFinal);

      // No actualizar facturaSeleccionada aquí para evitar bucle infinito
      // El saldo pendiente ya se actualizó con setSaldoPendiente

    } catch (error) {
      console.error("Error al calcular saldo:", error);
      console.log('Usando total facturado como saldo por defecto:', facturaSeleccionada.Total_Facturado);
      setSaldoPendiente(facturaSeleccionada.Total_Facturado);
    }
  }, [facturaSeleccionada]);

  const handleRegistrarPago = async () => {
    console.log('Debug - Saldo pendiente:', saldoPendiente);
    console.log('Debug - Factura seleccionada:', facturaSeleccionada);
    
    if (!facturaSeleccionada) {
      mostrarToast("Seleccione una factura para registrar el pago.", "error");
      return;
    }
    if (!montoPago || parseFloat(montoPago) <= 0) {
      mostrarToast("Ingrese un monto válido para el pago.", "error");
      return;
    }
    if (saldoPendiente <= 0) {
      mostrarToast("Esta factura ya está completamente pagada.", "error");
      return;
    }
    if (parseFloat(montoPago) > saldoPendiente) {
      mostrarToast(`El monto no puede ser mayor al saldo pendiente: L ${saldoPendiente.toFixed(2)}`, "error");
      return;
    }
    if (!formaPago) {
      mostrarToast("Seleccione una forma de pago.", "error");
      return;
    }
    if (!fechaPago) {
      mostrarToast("Seleccione la fecha del pago.", "error");
      return;
    }

    try {
      setLoading(true);

      const pagoData = {
        idFactura: facturaSeleccionada.idFactura,
        monto: parseFloat(montoPago),
        idFormaPago: parseInt(formaPago),
        fechaPago: new Date(fechaPago).toISOString(),
        observaciones: observaciones.trim() || null
      };

      const response = await pagoService.crearPago(pagoData);

      // Agregar el nuevo pago a la lista
      const nuevoPago = {
        ...response.pago,
        factura: facturaSeleccionada.numero || facturaSeleccionada.idFactura,
        cliente: `${facturaSeleccionada.cliente?.persona?.Pnombre || ''} ${facturaSeleccionada.cliente?.persona?.Papellido || ''}`.trim(),
        formaPago: formasPago.find(fp => fp.idFormaPago === parseInt(formaPago))?.Formapago || 'N/A'
      };

      setPagosRegistrados([nuevoPago, ...pagosRegistrados]);

      // Actualizar saldo pendiente
      await calcularSaldoPendiente();

      // Limpiar formulario
      setMontoPago("");
      setFormaPago("");
      setObservaciones("");

      mostrarToast("Pago registrado con éxito.", "success");

    } catch (error) {
      console.error("Error al registrar pago:", error);
      const mensaje = error.response?.data?.mensaje || "Error al registrar el pago";
      mostrarToast(mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  const mostrarToast = (mensaje, tipo) => {
    setToastMessage(mensaje);
    setToastType(tipo);
    setShowToast(true);
  };

  // Generar recibo PDF
  const generarReciboPDF = (pago) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Recibo de Pago - Óptica Velásquez", 14, 20);

    doc.setFontSize(12);
    doc.text(`Factura: ${pago.factura}`, 14, 30);
    doc.text(`Cliente: ${pago.cliente}`, 14, 40);
    doc.text(`Monto: L ${pago.monto.toFixed(2)}`, 14, 50);
    doc.text(`Forma de Pago: ${pago.formaPago}`, 14, 60);
    doc.text(`Fecha: ${new Date(pago.fechaPago).toLocaleDateString('es-HN')}`, 14, 70);
    doc.text(`ID Pago: ${pago.idPago}`, 14, 80);

    doc.save(`recibo-${pago.factura}-${pago.idPago}.pdf`);
  };

  // Filtrar facturas con saldo pendiente
  const facturasConSaldo = facturas.filter(factura => {
    if (factura.estadoFactura === 'anulada') return false;
    
    // Si ya calculamos el saldo, usar ese valor
    if (factura.saldoPendiente !== undefined) {
      return factura.saldoPendiente > 0;
    }
    
    // Si no, usar el total como saldo inicial
    return factura.Total_Facturado > 0;
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Cuando se selecciona factura, calcular saldo pendiente
  useEffect(() => {
    if (facturaSeleccionada?.idFactura) {
      calcularSaldoPendiente();
      setMontoPago("");
      setFormaPago("");
      setFechaPago(new Date().toISOString().split("T")[0]);
      setObservaciones("");
    }
  }, [facturaSeleccionada?.idFactura, calcularSaldoPendiente]); // Solo cuando cambie el ID de la factura

  if (loadingFacturas || loadingFormasPago) {
    return (
      <>
        <HeaderBlanco />
        <Container className="mt-4">
          <Card>
            <CardBody className="text-center">
              <Spinner color="primary" />
              <p className="mt-2">Cargando datos...</p>
            </CardBody>
          </Card>
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
              <Card className="shadow">
          <CardBody>
            <h4>Registrar Pago</h4>

            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label>Seleccionar Factura</Label>
                  <Input
                    type="select"
                    value={facturaSeleccionada ? facturaSeleccionada.idFactura : ""}
                    onChange={(e) => {
                      const factura = facturas.find(
                        (f) => f.idFactura === parseInt(e.target.value)
                      );
                      setFacturaSeleccionada(factura || null);
                    }}
                  >
                    <option value="">Seleccione una factura</option>
                    {facturasConSaldo.map((factura) => (
                      <option key={factura.idFactura} value={factura.idFactura}>
                        {factura.idFactura} - {factura.cliente?.persona?.Pnombre || ''} {factura.cliente?.persona?.Papellido || ''} 
                        (Saldo: L {(factura.saldoPendiente || factura.Total_Facturado).toFixed(2)})
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            {facturaSeleccionada && (
              <Alert color="info">
                <strong>Factura seleccionada:</strong> {facturaSeleccionada.idFactura} - {facturaSeleccionada.cliente?.persona?.Pnombre || ''} {facturaSeleccionada.cliente?.persona?.Papellido || ''}
                <br />
                <strong>Total:</strong> L {facturaSeleccionada.Total_Facturado.toFixed(2)} |{" "}
                <strong>Saldo pendiente:</strong> L {saldoPendiente.toFixed(2)}
              </Alert>
            )}

            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label>Monto a pagar (L)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Ingrese monto"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    disabled={!facturaSeleccionada}
                  />
                  {facturaSeleccionada && (
                    <small className="form-text text-muted">
                      Saldo pendiente: L {saldoPendiente.toFixed(2)}
                      {saldoPendiente <= 0 && (
                        <span className="text-danger ml-2">
                          ⚠️ Esta factura ya está completamente pagada
                        </span>
                      )}
                    </small>
                  )}
                </FormGroup>
              </Col>
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
                    {formasPago.map((forma) => (
                      <option key={forma.idFormaPago} value={forma.idFormaPago}>
                        {forma.Formapago}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row form>
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
              <Col md={6}>
                <FormGroup>
                  <Label>Observaciones (opcional)</Label>
                  <Input
                    type="textarea"
                    placeholder="Observaciones del pago"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    disabled={!facturaSeleccionada}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Button
              color="primary"
              onClick={handleRegistrarPago}
              disabled={!facturaSeleccionada || loading}
            >
              {loading ? <Spinner size="sm" /> : "Registrar Pago"}
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
                    <th>Estado</th>
                    <th>Recibo</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosRegistrados.map((pago) => (
                    <tr key={pago.idPago}>
                      <td>{pago.idPago}</td>
                      <td>{pago.factura || pago.idFactura}</td>
                      <td>{pago.cliente || `${pago.factura?.cliente?.persona?.Pnombre || ''} ${pago.factura?.cliente?.persona?.Papellido || ''}`}</td>
                      <td>{pago.monto.toFixed(2)}</td>
                      <td>{pago.formaPago || pago.formaPago?.Formapago || 'N/A'}</td>
                      <td>{new Date(pago.fechaPago).toLocaleDateString('es-HN')}</td>
                      <td>
                        <span className={`badge badge-${pago.estado === 'activo' ? 'success' : 'danger'}`}>
                          {pago.estado === 'activo' ? 'Activo' : 'Anulado'}
                        </span>
                      </td>
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
            </Col>
          </Row>
        </Container>

      <Toast
        isOpen={showToast}
        toggle={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
};

export default RegistrarPago;
