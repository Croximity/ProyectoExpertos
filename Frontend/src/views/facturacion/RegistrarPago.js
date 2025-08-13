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

  const cargarDatosIniciales = useCallback(async () => {
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
  }, []);

  const calcularSaldoPendiente = useCallback(async () => {
    if (!facturaSeleccionada) return;

    try {
      // Obtener pagos de la factura seleccionada
      const pagosResponse = await pagoService.obtenerPagosPorFactura(facturaSeleccionada.idFactura);
      const pagosFactura = pagosResponse.pagos || pagosResponse;
      
      // Calcular total pagado
      const totalPagado = pagosFactura.reduce((sum, pago) => {
        return pago.estado === 'activo' ? sum + pago.monto : sum;
      }, 0);

      // Calcular saldo pendiente
      const saldo = facturaSeleccionada.Total_Facturado - totalPagado;
      const saldoFinal = saldo > 0 ? saldo : 0;
      
      setSaldoPendiente(saldoFinal);

    } catch (error) {
      console.error("Error al calcular saldo:", error);
      setSaldoPendiente(facturaSeleccionada.Total_Facturado);
    }
  }, [facturaSeleccionada]);

  const handleRegistrarPago = async () => {
    
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

      // Formatear la fecha correctamente para el backend
      let fechaPagoFormateada;
      try {
        // Si la fecha viene como string YYYY-MM-DD, convertirla a ISO
        if (fechaPago && typeof fechaPago === 'string') {
          // Agregar la hora actual si solo viene la fecha
          const fechaCompleta = fechaPago.includes('T') ? fechaPago : `${fechaPago}T00:00:00.000Z`;
          fechaPagoFormateada = new Date(fechaCompleta).toISOString();
        } else {
          fechaPagoFormateada = new Date().toISOString();
        }
      } catch (error) {
        console.error('Error formateando fecha:', error);
        fechaPagoFormateada = new Date().toISOString();
      }

      const pagoData = {
        idFactura: facturaSeleccionada.idFactura,
        monto: parseFloat(montoPago),
        idFormaPago: parseInt(formaPago),
        fechaPago: fechaPagoFormateada,
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
      
      // Manejar errores de validación específicos
      if (error.response?.data?.errores && Array.isArray(error.response.data.errores)) {
        const erroresValidacion = error.response.data.errores;
        // Mostrar el primer error de validación
        const primerError = erroresValidacion[0];
        const mensaje = primerError.msg || primerError.message || "Error de validación";
        mostrarToast(mensaje, "error");
      } else {
        const mensaje = error.response?.data?.mensaje || error.message || "Error al registrar el pago";
        mostrarToast(mensaje, "error");
      }
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
  const generarReciboPDF = async (pago) => {
    const doc = new jsPDF();

    // Obtener datos del pago de forma segura
    const numeroFactura = typeof pago.factura === 'object' ? pago.factura.idFactura : (pago.factura || pago.idFactura);
    const nombreCliente = pago.cliente || 
      (pago.factura?.cliente?.persona ? 
        `${pago.factura.cliente.persona.Pnombre || ''} ${pago.factura.cliente.persona.Papellido || ''}`.trim() : 
        'Cliente no especificado'
      );
    const formaPago = typeof pago.formaPago === 'object' ? 
      pago.formaPago.Formapago : 
      (pago.formaPago || 'N/A');

    // Obtener información adicional de la factura para calcular saldos
    let totalFactura = 0;
    let saldoPendiente = 0;
    let estadoFactura = 'Activa';
    
    try {
      // Buscar la factura en el estado local
      const facturaLocal = facturas.find(f => f.idFactura === parseInt(numeroFactura));
      if (facturaLocal) {
        totalFactura = facturaLocal.Total_Facturado || 0;
        // Calcular saldo pendiente considerando este pago
        saldoPendiente = Math.max(0, totalFactura - (pago.monto || 0));
        estadoFactura = saldoPendiente === 0 ? 'Completamente Pagada' : 'Parcialmente Pagada';
      }
    } catch (error) {
      console.error('Error obteniendo información de factura:', error);
    }

    // Configuración de colores y estilos
    const primaryColor = [41, 128, 185]; // Azul profesional
    const secondaryColor = [52, 73, 94]; // Gris oscuro
    const successColor = [46, 204, 113]; // Verde para confirmación

    // Encabezado principal
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text("ÓPTICA VELÁSQUEZ", 105, 18, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica-bold', 'normal');
    doc.text("Especialistas en Salud Visual", 105, 25, { align: 'center' });

    // Título del recibo
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("RECIBO DE PAGO", 105, 40, { align: 'center' });

    // Información del pago
    const startY = 50;
    const lineHeight = 6; // Reducido de 8 a 6
    let currentY = startY;

    // Número de recibo
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Número de Recibo:", 14, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`#${pago.idPago.toString().padStart(6, '0')}`, 70, currentY);
    currentY += lineHeight + 1; // Reducido de +2 a +1

    // Fecha del pago
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text("Fecha de Pago:", 14, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(pago.fechaPago).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), 70, currentY);
    currentY += lineHeight + 1; // Reducido de +2 a +1

    // Información de la factura
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text("Factura:", 14, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`#${numeroFactura}`, 70, currentY);
    currentY += lineHeight + 1; // Reducido de +2 a +1

    // Cliente
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text("Cliente:", 14, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(nombreCliente, 70, currentY);
    currentY += lineHeight + 1; // Reducido de +2 a +1

    // Forma de pago
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text("Forma de Pago:", 14, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(formaPago, 70, currentY);
    currentY += lineHeight + 1; // Reducido de +2 a +1

    // Línea separadora después del monto
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.3);
    doc.line(14, currentY, 196, currentY);
    currentY += 8; // Reducido de 8 a 5

    // Total de la factura
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text("Total de la Factura:", 14, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`L ${totalFactura.toFixed(2)}`, 70, currentY);
    currentY += lineHeight + 1; // Reducido de +2 a +1

    // Monto pagado en este recibo
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text("Monto de este Pago:", 14, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`L ${pago.monto.toFixed(2)}`, 70, currentY);
    currentY += lineHeight + 1; // Reducido de +2 a +1

    // Saldo pendiente
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text("Saldo Pendiente:", 14, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`L ${saldoPendiente.toFixed(2)}`, 70, currentY);
    currentY += lineHeight + 1; // Reducido de +2 a +1

    // Estado de la factura
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text("Estado de la Factura:", 14, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(estadoFactura, 70, currentY);
    currentY += lineHeight + 2; // Reducido de +3 a +2

    // Línea separadora después del resumen financiero
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.3);
    doc.line(14, currentY, 196, currentY);
    currentY += 8; // Reducido de 8 a 5

    // Estado del pago
    doc.setTextColor(...successColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Estado del Pago:", 14, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text("Pago Confirmado", 70, currentY);
    currentY += lineHeight + 1; // Reducido de +2 a +1

    // Indicador visual del progreso de pago
    if (saldoPendiente === 0) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Factura Completamente Pagada", 70, currentY);
      currentY += lineHeight + 2; // Reducido de +3 a +2
    } else {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Pendiente por pagar: L ${saldoPendiente.toFixed(2)}`, 70, currentY);
      currentY += lineHeight + 2; // Reducido de +3 a +2
    }


    // Observaciones (si existen)
    if (pago.observaciones && pago.observaciones.trim()) {
      currentY += 3; // Reducido de 5 a 3
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text("Observaciones:", 14, currentY);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      // Manejar texto largo en observaciones
      const maxWidth = 120;
      const words = pago.observaciones.split(' ');
      let line = '';
      let lines = [];
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        if (doc.getTextWidth(testLine) > maxWidth && line !== '') {
          lines.push(line);
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      lines.forEach((line, index) => {
        if (currentY < 250) { // Evitar que se salga de la página
          doc.text(line.trim(), 70, currentY);
          currentY += lineHeight - 1; // Reducido el espaciado entre líneas de observaciones
        }
      });
    }

         // Pie de página - se posiciona dinámicamente después del último contenido
     // Agregar un poco de espacio antes del pie de página
     currentY += 5;
     
     // Línea separadora del pie de página
     doc.setDrawColor(...primaryColor);
     doc.setLineWidth(0.5);
     doc.line(14, currentY, 196, currentY);
     currentY += 3; // Reducido de 5 a 3

     doc.setTextColor(...secondaryColor);
     doc.setFontSize(9);
     doc.setFont('helvetica', 'normal');
     doc.text("Este documento es un comprobante oficial de pago.", 105, currentY, { align: 'center' });
     currentY += 3; // Reducido de 5 a 3
     doc.text("Conserve este recibo para sus registros.", 105, currentY, { align: 'center' });
     currentY += 3; // Reducido de 5 a 3
     doc.text("Gracias por su confianza en Óptica Velásquez", 105, currentY, { align: 'center' });
    // Guardar el PDF
    doc.save(`recibo-pago-${numeroFactura}-${pago.idPago}.pdf`);
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
                  <Label>Monto a pagar (L) *</Label>
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
                  <Label>Forma de pago *</Label>
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
                  <Label>Fecha de pago *</Label>
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
                  <Label>Observaciones *</Label>
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
                      <td>{typeof pago.factura === 'object' ? pago.factura.idFactura : (pago.factura || pago.idFactura)}</td>
                      <td>
                        {pago.cliente || 
                         (pago.factura?.cliente?.persona ? 
                           `${pago.factura.cliente.persona.Pnombre || ''} ${pago.factura.cliente.persona.Papellido || ''}`.trim() : 
                           'N/A'
                         )
                        }
                      </td>
                      <td>{pago.monto.toFixed(2)}</td>
                      <td>
                        {typeof pago.formaPago === 'object' ? 
                          pago.formaPago.Formapago : 
                          (pago.formaPago || 'N/A')
                        }
                      </td>
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
                          onClick={async () => await generarReciboPDF(pago)}
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
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default RegistrarPago;
