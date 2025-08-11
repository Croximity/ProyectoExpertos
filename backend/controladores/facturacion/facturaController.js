const Factura = require('../../modelos/facturacion/Factura');
const db = require('../../configuraciones/db');
const FacturaDetalle = require('../../modelos/facturacion/FacturaDetalle');
const DetalleDescuento = require('../../modelos/facturacion/DetalleDescuento');
const Cliente = require('../../modelos/gestion_cliente/Cliente');  
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const Empleado = require('../../modelos/gestion_cliente/Empleado');  
const Persona = require('../../modelos/seguridad/Persona');  


//validaciones
const { body, validationResult } = require('express-validator');

exports.validarCrearFacturaCompleta = [

  body('factura.idCliente')
    .notEmpty().withMessage('idCliente es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo'),

  body('factura.idFormaPago')
    .notEmpty().withMessage('idFormaPago es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo'),

  body('factura.idEmpleado')
    .notEmpty().withMessage('idEmpleado es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo'),

  body('factura.Tipo_documento')
    .optional()
    .isString().withMessage('Tipo_documento debe ser texto')
    .isLength({ max: 45 }).withMessage('Máximo 45 caracteres'),

  body('factura.Fecha')
    .optional()
    .isISO8601().withMessage('Debe ser una fecha válida'),

  body('factura.Total_Facturado')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Total_Facturado debe ser un número positivo'),

  body('factura.estadoFactura')
    .optional()
    .isIn(['activa', 'anulada']).withMessage('estadoFactura debe ser "activa" o "anulada"'),

  // Validaciones básicas para los arrays
  body('detalles')
    .isArray({ min: 1 }).withMessage('Debes enviar al menos un detalle'),

  body('descuentos')
    .optional()
    .isArray().withMessage('descuentos debe ser un arreglo'),

  
];

// Middleware para manejar errores
exports.manejarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};



// Crear una factura simple
exports.crearFactura = async (req, res) => {
  try {
    const factura = await Factura.create(req.body);

    // --- Generar PDF de la factura aquí ---
    // Por ejemplo, usando pdfkit o cualquier otra librería
    // const doc = new PDFDocument();
    // doc.pipe(fs.createWriteStream(rutaPDF));
    // doc.text('Contenido de la factura...');
    // doc.end();

    // Simulación de nombre de archivo PDF
    const nombreArchivo = `factura_${factura.idFactura}.pdf`;
    const rutaPDF = path.join(__dirname, '../../uploads', nombreArchivo);

    // Aquí deberías generar y guardar el PDF en rutaPDF

    // Guardar el nombre del archivo PDF en la factura
    factura.archivo_pdf = nombreArchivo;
    await factura.save();

    res.status(201).json({ mensaje: 'Factura creada', factura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear factura', error: error.message });
  }
};

// Obtener todas las facturas
exports.obtenerFacturas = async (req, res) => {
  try {
    const facturas = await Factura.findAll();
    res.json({ facturas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener facturas', error: error.message });
  }
};

// Obtener factura por ID
exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    if (!factura) return res.status(404).json({ mensaje: 'Factura no encontrada' });
    res.json({ factura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener factura', error: error.message });
  }
};

// Editar una factura
exports.editarFactura = (req, res) => {
  return res.status(403).json({
    mensaje: 'Prohibido: Las facturas no pueden ser modificadas según regulación de la SAR. Deben ser anuladas.'
  });
};



// Anular una factura (estadoFactura = 'anulada')
exports.anularFactura = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);

    if (!factura) return res.status(404).json({ mensaje: 'Factura no encontrada' });

    if (factura.estadoFactura === 'anulada') {
      return res.status(400).json({ mensaje: 'La factura ya está anulada' });
    }

    factura.estadoFactura = 'anulada';
    await factura.save();

    res.json({ mensaje: 'Factura anulada correctamente', factura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al anular factura', error: error.message });
  }
};
  
  
// ------------------------------------------------------------------------------------------  
// Configurar formateadores de moneda hondureña    
const formatearMoneda = new Intl.NumberFormat('es-HN', {    
  style: 'currency',    
  currency: 'HNL',    
  minimumFractionDigits: 2,    
  maximumFractionDigits: 2    
});    
    
const formatearNumero = new Intl.NumberFormat('es-HN', {    
  minimumFractionDigits: 2,    
  maximumFractionDigits: 2    
});    
    
// ------------------------------------------------------------------------------------------    
// Crear una factura completa (con detalles y descuentos)    
exports.crearFacturaCompleta = async (req, res) => {      
  const t = await db.transaction();      
      
  try {      
    let { factura, detalles, descuentos } = req.body;      
      
    // Si no vienen descuentos, asignar uno por defecto para evitar error "no iterable"      
    descuentos = descuentos && descuentos.length > 0      
      ? descuentos      
      : [{ idDescuento: 0, monto: 0 }];      
    
    // 1. Crear factura con fecha automática  
    if (!factura.Fecha) {  
      factura.Fecha = new Date();  
    }  
    const nuevaFactura = await Factura.create(factura, { transaction: t });
      
    // 2. Agregar ID de factura a cada detalle y mapear idProducto a idProductoAtributo
    const ProductoAtributo = require('../../modelos/productos/ProductoAtributo');
    
    for (let d of detalles) {    
      d.idFactura = nuevaFactura.idFactura;    
      
      // Si hay un idProducto, buscar el idProductoAtributo correspondiente
      if (d.idProducto) {
        try {
          const productoAtributo = await ProductoAtributo.findOne({
            where: { idProducto: d.idProducto }
          });
          
          if (productoAtributo) {
            d.idProductoAtributo = productoAtributo.idProductoAtributo;
          } else {
            // Si no existe ProductoAtributo, crear uno por defecto
            const nuevoProductoAtributo = await ProductoAtributo.create({
              idProducto: d.idProducto,
              idAtributo: 1, // Atributo por defecto
              stockActual: 0
            }, { transaction: t });
            d.idProductoAtributo = nuevoProductoAtributo.idProductoAtributo;
          }
        } catch (error) {
          console.error('Error al buscar/crear ProductoAtributo:', error);
          // Continuar sin ProductoAtributo si hay error
        }
      }
    }    
        
    // 3. Crear detalles    
    await FacturaDetalle.bulkCreate(detalles, { transaction: t });      
      
    // 4. Agregar ID de factura a cada descuento      
    for (let d of descuentos) {      
      d.idFactura = nuevaFactura.idFactura;      
    }      
      
    // 5. Crear descuentos      
    await DetalleDescuento.bulkCreate(descuentos, { transaction: t });      
      
    // -- OBTENER DATOS COMPLETOS DE LA BASE DE DATOS ---      
          
    // Obtener cliente con sus datos de persona      
    const cliente = await Cliente.findByPk(nuevaFactura.idCliente, {      
      include: [{      
        model: Persona,      
        as: 'persona'      
      }]      
    });      
      
    // Obtener empleado con sus datos de persona      
    const empleado = await Empleado.findByPk(nuevaFactura.idEmpleado, {      
      include: [{      
        model: Persona,      
        as: 'persona'     
      }]      
    });      
      
    // Obtener productos directamente del modelo ProductoModel (solo para detalles con idProducto)
    const ProductoModel = require('../../modelos/productos/ProductoModel');        
    const detallesConProductos = await Promise.all(          
      detalles.map(async (detalle) => {          
        // Si es entrada manual, no hay producto que buscar
        if (!detalle.idProducto) {
          return {          
            ...detalle,          
            producto: null      
          };          
        }
        
        const producto = await ProductoModel.findByPk(detalle.idProducto);        
        return {          
          ...detalle,          
          producto: producto      
        };          
      })          
    );   
      
    // --- Generar PDF de la factura ---      
    const nombreArchivo = `factura_${nuevaFactura.idFactura}.pdf`;      
    const rutaPDF = path.join(__dirname, '../../uploads', nombreArchivo);      
      
    const doc = new PDFDocument({ 
      margin: 40,
      size: 'A4',
      layout: 'portrait'
    });        
    doc.pipe(fs.createWriteStream(rutaPDF));        
            
    // ===== ENCABEZADO MEJORADO =====
    // Fondo del encabezado
    doc.rect(0, 0, 595, 120)
      .fill('#1E3A8A'); // Azul profesional
    
    // Logo placeholder (círculo con iniciales)
    doc.circle(80, 60, 25)
      .fill('#3B82F6')
      .stroke('#60A5FA', 2);
    
    doc.fontSize(16).font('Helvetica-Bold')
      .fillColor('white')
      .text('OV', 70, 50, { align: 'center' });
    
    // Logo/Texto de la empresa con mejor tipografía
    doc.fontSize(24).font('Helvetica-Bold')
      .fillColor('white')
      .text('ÓPTICA VELÁSQUEZ', { align: 'center' }, 40, 25);
    
    // Información de la empresa
    doc.fontSize(10).font('Helvetica')
      .fillColor('#E5E7EB')
      .text('Especialistas en Salud Visual', { align: 'center' }, 40, 55);
    
    // Información fiscal en dos columnas
    doc.fontSize(8).font('Helvetica-Bold')
      .fillColor('white');
    
    // Columna izquierda
    doc.text('RTN:', 50, 80)
      .font('Helvetica')
      .text('0301201505686', 80, 80);
    
    doc.font('Helvetica-Bold')
      .text('CAI:', 50, 95)
      .font('Helvetica')
      .text('ACD2155QWJJ254254', 80, 95);
    
    // Columna derecha
    doc.font('Helvetica-Bold')
      .text('RANGO:', 300, 80)
      .font('Helvetica')
      .text('00000001 - 99999999', 350, 80);
    
    doc.font('Helvetica-Bold')
      .text('VENCE:', 300, 95)
      .font('Helvetica')
      .text('31/12/2025', 350, 95);
    
    // Información de contacto
    doc.fontSize(8).font('Helvetica')
      .fillColor('#E5E7EB')
      .text('📍 Barrio Abajo, Comayagua, Honduras', { align: 'center' }, 40, 110);
    
    doc.fontSize(8).font('Helvetica')
      .text('📞 88277998 | ✉️ opticavelazques@gmail.com', { align: 'center' }, 40, 120);
    
    // ===== TÍTULO DE LA FACTURA =====
    doc.fillColor('#1F2937'); // Gris oscuro para el título
    doc.fontSize(20).font('Helvetica-Bold')
      .text('FACTURA', { align: 'center' }, 40, 150);
    
    // Línea decorativa bajo el título
    doc.strokeColor('#3B82F6')
      .lineWidth(2)
      .moveTo(150, 175)
      .lineTo(445, 175)
      .stroke();
    
    // ===== INFORMACIÓN DE LA FACTURA =====
    const infoY = 200;
    
    // Panel izquierdo - Información de la factura
    doc.rect(40, infoY - 10, 250, 80)
      .fillAndStroke('#F3F4F6', '#E5E7EB');
    
    doc.fontSize(10).font('Helvetica-Bold')
      .fillColor('#374151')
      .text('INFORMACIÓN DE LA FACTURA', 50, infoY);
    
    doc.fontSize(9).font('Helvetica-Bold')
      .text('No. Factura:', 50, infoY + 20)
      .font('Helvetica')
      .fillColor('#6B7280')
      .text(nuevaFactura.idFactura.toString().padStart(8, '0'), 130, infoY + 20);
    
    doc.font('Helvetica-Bold')
      .fillColor('#374151')
      .text('Fecha:', 50, infoY + 35)
      .font('Helvetica')
      .fillColor('#6B7280')
      .text(new Date(nuevaFactura.Fecha).toLocaleDateString('es-HN'), 130, infoY + 35);
    
    doc.font('Helvetica-Bold')
      .fillColor('#374151')
      .text('Tipo:', 50, infoY + 50)
      .font('Helvetica')
      .fillColor('#6B7280')
      .text(nuevaFactura.Tipo_documento || 'FACTURA', 130, infoY + 50);
    
    // Panel derecho - Información del cliente
    doc.rect(310, infoY - 10, 245, 80)
      .fillAndStroke('#F3F4F6', '#E5E7EB');
    
    doc.fontSize(10).font('Helvetica-Bold')
      .fillColor('#374151')
      .text('INFORMACIÓN DEL CLIENTE', 320, infoY);
    
    const clientePersona = cliente?.persona;      
    const nombreCliente = clientePersona ?       
      `${empleadoPersona.Pnombre} ${empleadoPersona.Snombre || ''} ${empleadoPersona.Papellido} ${empleadoPersona.Sapellido || ''}`.trim() : 'N/A';
    
    doc.fontSize(9).font('Helvetica-Bold')
      .text('Cliente:', 320, infoY + 20)
      .font('Helvetica')
      .fillColor('#6B7280')
      .text(nombreCliente, 380, infoY + 20);
    
    const rtnCliente = clientePersona?.DNI;      
    const tieneRTN = rtnCliente && rtnCliente.length >= 13;
    
    doc.font('Helvetica-Bold')
      .fillColor('#374151')
      .text(tieneRTN ? 'RTN:' : 'ID:', 320, infoY + 35)
      .font('Helvetica')
      .fillColor('#6B7280')
      .text(rtnCliente || 'N/A', 380, infoY + 35);
    
    doc.font('Helvetica-Bold')
      .fillColor('#374151')
      .text('Dirección:', 320, infoY + 50)
      .font('Helvetica')
      .fillColor('#6B7280')
      .text(clientePersona ? (clientePersona.Direccion || 'N/A') : 'N/A', 380, infoY + 50);
    
    // Información del empleado
    const empleadoPersona = empleado?.persona;      
    const nombreEmpleado = empleadoPersona ?       
      `${empleadoPersona.Pnombre} ${empleadoPersona.Snombre || ''} ${empleadoPersona.Papellido} ${empleadoPersona.Sapellido || ''}`.trim() : 'N/A';
    
    doc.fontSize(9).font('Helvetica-Bold')
      .fillColor('#374151')
      .text('Atendido por:', 50, infoY + 90)
      .font('Helvetica')
      .fillColor('#6B7280')
      .text(nombreEmpleado, 130, infoY + 90);
    
    // ===== TABLA DE PRODUCTOS/SERVICIOS =====
    const tableY = infoY + 120;
    
    // Encabezado de la tabla con fondo
    doc.rect(40, tableY - 10, 515, 25)
      .fillAndStroke('#1E3A8A', '#1E3A8A');
    
    doc.fontSize(10).font('Helvetica-Bold')
      .fillColor('white')
      .text('CÓDIGO', 50, tableY)
      .text('DESCRIPCIÓN', 120, tableY)
      .text('CANT.', 320, tableY)
      .text('P. UNIT.', 380, tableY)
      .text('TOTAL', 480, tableY);
    
    // Líneas de la tabla
    let currentY = tableY + 25;
    doc.fontSize(9).font('Helvetica')
      .fillColor('#374151');
    
    for (let i = 0; i < detallesConProductos.length; i++) {      
      const detalle = detallesConProductos[i];      
      const producto = detalle.producto;      
            
      // Validación defensiva para precios
      const precioReal = Number(producto?.precioVenta || detalle.precioUnitario || 0);    
      const cantidad = Number(detalle.cantidad || 0);    
      const totalLinea = cantidad * precioReal;
            
      // Para entrada manual, usar información del detalle; para productos, usar información del producto
      const codigoProducto = producto ? producto.idProducto.toString().padStart(3, '0') : (detalle.idProducto || '000').toString().padStart(3, '0');
      const nombreProducto = producto ? producto.Nombre : (detalle.nombreProducto || 'Producto/Servicio');
      
      // Fondo alternado para las filas
      if (i % 2 === 0) {
        doc.rect(40, currentY - 5, 515, 20)
          .fill('#F9FAFB');
      }
      
      doc.text(codigoProducto, 50, currentY);      
      doc.text(nombreProducto, 120, currentY);      
      doc.text(cantidad.toString(), 320, currentY);      
      doc.text(`L. ${formatearNumero.format(precioReal)}`, 380, currentY);      
      doc.text(`L. ${formatearNumero.format(totalLinea)}`, 480, currentY);      
            
      currentY += 25;      
    }
    
    // Borde de la tabla
    doc.rect(40, tableY - 10, 515, currentY - tableY + 15)
      .stroke('#E5E7EB');
    
    // ===== TOTALES =====
    const totalsY = currentY + 20;
    
    // Panel de totales con fondo
    doc.rect(350, totalsY - 10, 205, 120)
      .fillAndStroke('#F3F4F6', '#E5E7EB');
    
    // Calcular totales
    const subtotal = detallesConProductos.reduce((sum, detalle) => {        
      const producto = detalle.producto;        
      const precioReal = Number(producto?.precioVenta || detalle.precioUnitario || 0);      
      const cantidad = Number(detalle.cantidad || 0);      
      return sum + (cantidad * precioReal);        
    }, 0);   
            
    const totalDescuentos = descuentos.reduce((sum, desc) => sum + Number(desc.monto || 0), 0);        
    const subtotalConDescuento = subtotal - totalDescuentos;        
    const isv = subtotalConDescuento * 0.15;        
    const totalFinal = subtotalConDescuento + isv;
    
    doc.fontSize(10).font('Helvetica-Bold')
      .fillColor('#374151')
      .text('RESUMEN DE TOTALES', 360, totalsY);
    
    doc.fontSize(9).font('Helvetica')
      .fillColor('#6B7280')
      .text('Subtotal:', 360, totalsY + 25)
      .font('Helvetica-Bold')
      .fillColor('#374151')
      .text(`L. ${formatearNumero.format(subtotal)}`, 480, totalsY + 25);
    
    if (totalDescuentos > 0) {
      doc.font('Helvetica')
        .fillColor('#6B7280')
        .text('Descuentos:', 360, totalsY + 40)
        .font('Helvetica-Bold')
        .fillColor('#DC2626')
        .text(`-L. ${formatearNumero.format(totalDescuentos)}`, 480, totalsY + 40);
      
      doc.font('Helvetica')
        .fillColor('#6B7280')
        .text('Subtotal con descuento:', 360, totalsY + 55)
        .font('Helvetica-Bold')
        .fillColor('#374151')
        .text(`L. ${formatearNumero.format(subtotalConDescuento)}`, 480, totalsY + 55);
    }
    
    doc.font('Helvetica')
      .fillColor('#6B7280')
      .text('ISV (15%):', 360, totalsY + (totalDescuentos > 0 ? 70 : 40))
      .font('Helvetica-Bold')
      .fillColor('#374151')
      .text(`L. ${formatearNumero.format(isv)}`, 480, totalsY + (totalDescuentos > 0 ? 70 : 40));
    
    // Línea separadora antes del total
    doc.strokeColor('#D1D5DB')
      .lineWidth(1)
      .moveTo(360, totalsY + (totalDescuentos > 0 ? 85 : 55))
      .lineTo(555, totalsY + (totalDescuentos > 0 ? 85 : 55))
      .stroke();
    
    // Total final destacado
    doc.fontSize(12).font('Helvetica-Bold')
      .fillColor('#1E3A8A')
      .text('TOTAL:', 360, totalsY + (totalDescuentos > 0 ? 105 : 75))
      .text(`L. ${formatearNumero.format(totalFinal)}`, 480, totalsY + (totalDescuentos > 0 ? 105 : 75));
    
    // Actualizar el Total_Facturado en la factura    
    nuevaFactura.Total_Facturado = totalFinal;    
    await nuevaFactura.save({ transaction: t });
    
    // ===== INFORMACIÓN LEGAL Y FIRMA =====
    const legalY = totalsY + 140;
    
    // Panel de información legal
    doc.rect(40, legalY - 10, 515, 80)
      .fillAndStroke('#FEF3C7', '#F59E0B');
    
    doc.fontSize(8).font('Helvetica-Bold')
      .fillColor('#92400E')
      .text('INFORMACIÓN LEGAL Y TÉRMINOS', 50, legalY);
    
    doc.fontSize(7).font('Helvetica')
      .fillColor('#92400E')
      .text('• Esta factura es válida por 30 días desde la fecha de emisión', 50, legalY + 20)
      .text('• Resolución SAR No. 45145 | CAI: ACD2155QWJJ254254', 50, legalY + 32)
      .text('• Rango Autorizado: Del 00000001 al 99999999 | Fecha límite: 31/12/2025', 50, legalY + 44)
      .text('• Autorización 54120 | Este documento es válido en todo el territorio nacional', 50, legalY + 56);
    
    // Área de firma
    doc.rect(400, legalY - 10, 155, 80)
      .fillAndStroke('#F3F4F6', '#E5E7EB');
    
    doc.fontSize(8).font('Helvetica-Bold')
      .fillColor('#374151')
      .text('FIRMA Y SELLO', 420, legalY);
    
    doc.strokeColor('#9CA3AF')
      .lineWidth(1)
      .moveTo(420, legalY + 30)
      .lineTo(540, legalY + 30)
      .stroke();
    
    doc.fontSize(7).font('Helvetica')
      .fillColor('#6B7280')
      .text('Firma del Cliente', 420, legalY + 40);
    
    doc.fontSize(7).font('Helvetica')
      .fillColor('#6B7280')
      .text(`Atendido por: ${nombreEmpleado}`, 420, legalY + 60);
    
    // ===== PIE DE PÁGINA =====
    const footerY = legalY + 90;
    
    doc.strokeColor('#E5E7EB')
      .lineWidth(1)
      .moveTo(40, footerY)
      .lineTo(555, footerY)
      .stroke();
    
    doc.fontSize(8).font('Helvetica')
      .fillColor('#9CA3AF')
      .text('Gracias por confiar en Óptica Velásquez para su salud visual', { align: 'center' }, 40, footerY + 10)
      .text('📞 88277998 | ✉️ opticavelazques@gmail.com | 🌐 www.opticavelasquez.com', { align: 'center' }, 40, footerY + 25);
    
    doc.end();
  
    // Guardar el nombre del archivo PDF en la factura  
    nuevaFactura.archivo_pdf = nombreArchivo;  
    await nuevaFactura.save({ transaction: t });  
  
    // 6. INCREMENTAR facturasEmitidas en el CAI activo
    const CAI = require('../../modelos/facturacion/Cai');
    await CAI.increment('facturasEmitidas', {
      where: { activo: [true, 1] },
      transaction: t
    });
  
    // 7. Confirmar transacción  
    await t.commit();  
  
    res.status(201).json({  
      mensaje: 'Factura completa registrada con éxito',  
      factura: nuevaFactura  
    });  
  
  } catch (error) {  
    await t.rollback();  
    console.error(error);  
    res.status(500).json({  
      mensaje: 'Error al crear factura completa',  
      error: error.message  
    });  
  }  
};

// Crear factura por consulta médica
exports.crearFacturaPorConsulta = async (req, res) => {
  const t = await db.transaction();
  
  try {
    let { factura, consultas, descuentos } = req.body;
    
    // Si no vienen descuentos, asignar uno por defecto
    descuentos = descuentos && descuentos.length > 0
      ? descuentos
      : [{ idDescuento: 0, monto: 0 }];
    
    // 1. Crear factura con fecha automática y tipo consulta
    if (!factura.Fecha) {
      factura.Fecha = new Date();
    }
    factura.tipoFacturacion = 'consulta';
    
    const nuevaFactura = await Factura.create(factura, { transaction: t });
    
    // 2. Crear detalles de consultas
    const detallesConsultas = consultas.map(consulta => ({
      idFactura: nuevaFactura.idFactura,
      idConsulta: consulta.idConsulta,
      Cantidad: 1,
      precioUnitario: consulta.precio,
      descripcion: consulta.descripcion || `Consulta médica - ${consulta.tipo}`,
      totalLinea: consulta.precio
    }));
    
    await FacturaDetalle.bulkCreate(detallesConsultas, { transaction: t });
    
    // 3. Agregar ID de factura a cada descuento
    for (let d of descuentos) {
      d.idFactura = nuevaFactura.idFactura;
    }
    
    // 4. Crear descuentos
    await DetalleDescuento.bulkCreate(descuentos, { transaction: t });
    
    // 5. Obtener datos completos para el PDF
    const cliente = await Cliente.findByPk(nuevaFactura.idCliente, {
      include: [{
        model: Persona,
        as: 'persona'
      }]
    });
    
    const empleado = await Empleado.findByPk(nuevaFactura.idEmpleado, {
      include: [{
        model: Persona,
        as: 'persona'
      }]
    });
    
    // Obtener detalles de consultas con información completa
    const Consulta = require('../../modelos/gestion_cliente/Consulta');
    const detallesConConsultas = await Promise.all(
      detallesConsultas.map(async (detalle) => {
        const consulta = await Consulta.findByPk(detalle.idConsulta);
        return {
          ...detalle,
          consulta: consulta
        };
      })
    );
    
    // 6. Generar PDF de la factura
    const nombreArchivo = `factura_consulta_${nuevaFactura.idFactura}.pdf`;
    const rutaPDF = path.join(__dirname, '../../uploads', nombreArchivo);      
      
    const doc = new PDFDocument({ margin: 50 });        
    doc.pipe(fs.createWriteStream(rutaPDF));        
            
    // ENCABEZADO DE LA EMPRESA        
    doc.fontSize(16).font('Helvetica-Bold')      
      .text('ÓPTICA Velazques', { align: 'center' });      
    doc.fontSize(10).font('Helvetica')      
      .text('RTN: 0301201505686', { align: 'center' })      
      .text('CAI: ACD2155QWJJ254254', { align: 'center' })      
      .text('RANGO AUTORIZADO: Del 00000001 al 99999999', { align: 'center' })      
      .text('Dirección: Barrio Abajo, Comayagua, Honduras', { align: 'center' })      
      .text('Teléfono: 88277998 | Email: opticavelazques@gmail.com', { align: 'center' });      
          
    // Línea separadora        
    doc.moveTo(50, doc.y + 10).lineTo(550, doc.y + 10).stroke();        
    doc.moveDown(2);        
            
    // TÍTULO FACTURA        
    doc.fontSize(18).font('Helvetica-Bold')        
      .text('FACTURA - SERVICIOS MÉDICOS', { align: 'center' });
    doc.moveDown();        
            
    // INFORMACIÓN DE LA FACTURA
    const facturaY = doc.y;      
    doc.fontSize(10).font('Helvetica-Bold')      
      .text('FACTURA No:', 50, facturaY)      
      .font('Helvetica')      
      .text(nuevaFactura.idFactura.toString().padStart(8, '0'), 130, facturaY);      
          
    doc.font('Helvetica-Bold')      
      .text('FECHA EMISIÓN:', 50, facturaY + 15)      
      .font('Helvetica')      
      .text(new Date(nuevaFactura.Fecha).toLocaleDateString('es-HN'), 130, facturaY + 15);      
          
    doc.font('Helvetica-Bold')      
      .text('TIPO DOC:', 50, facturaY + 30)      
      .text('FACTURA CONSULTA', 130, facturaY + 30);
    
    // DATOS DEL EMPLEADO
    const empleadoPersona = empleado?.persona;      
    const nombreEmpleado = empleadoPersona ?       
      `${empleadoPersona.Pnombre} ${empleadoPersona.Snombre || ''} ${empleadoPersona.Papellido} ${empleadoPersona.Sapellido || ''}`.trim() : 'N/A';      
          
    doc.font('Helvetica-Bold')      
      .text('ATENDIDO POR:', 50, facturaY + 65)      
      .font('Helvetica')      
      .text(nombreEmpleado, 130, facturaY + 65);      
          
    // DATOS DEL CLIENTE
    const clientePersona = cliente?.persona;      
    const nombreCliente = clientePersona ?       
      `${clientePersona.Pnombre} ${clientePersona.Snombre || ''} ${clientePersona.Papellido} ${clientePersona.Sapellido || ''}`.trim() : 'N/A';      
          
    doc.font('Helvetica-Bold')      
      .text('CLIENTE:', 300, facturaY)      
      .font('Helvetica')      
      .text(nombreCliente, 350, facturaY);      
          
    doc.font('Helvetica-Bold')      
      .text('ID:', 300, facturaY + 15)
      .font('Helvetica')      
      .text(clientePersona?.DNI || 'N/A', 350, facturaY + 15);
          
    doc.font('Helvetica-Bold')      
      .text('DIRECCIÓN:', 300, facturaY + 30)      
      .font('Helvetica')      
      .text(clientePersona ? (clientePersona.Direccion || 'N/A') : 'N/A', 350, facturaY + 30);      
          
    doc.moveDown(6);        
            
    // TABLA DE SERVICIOS MÉDICOS
    const tableTop = doc.y;        
    const itemCodeX = 50;        
    const descriptionX = 120;        
    const quantityX = 320;        
    const priceX = 380;        
    const totalX = 480;        
            
    // Encabezados de tabla        
    doc.fontSize(9).font('Helvetica-Bold');        
    doc.text('CÓDIGO', itemCodeX, tableTop);        
    doc.text('DESCRIPCIÓN DEL SERVICIO', descriptionX, tableTop);
    doc.text('CANT.', quantityX, tableTop);        
    doc.text('P. UNIT.', priceX, tableTop);        
    doc.text('TOTAL', totalX, tableTop);        
            
    // Línea bajo encabezados        
    doc.moveTo(itemCodeX, tableTop + 15).lineTo(550, tableTop + 15).stroke();        
            
    // ITERAR SOBRE LOS SERVICIOS MÉDICOS
    let currentY = tableTop + 25;        
    doc.fontSize(8).font('Helvetica');        
            
    for (let i = 0; i < detallesConConsultas.length; i++) {
      const detalle = detallesConConsultas[i];
      const consulta = detalle.consulta;
      
      const precioReal = Number(detalle.precioUnitario || 0);
      const cantidad = Number(detalle.Cantidad || 1);
      const totalLinea = precioReal * cantidad;
      
      const precioFormateado = `L. ${formatearNumero.format(precioReal)}`;    
      const totalFormateado = `L. ${formatearNumero.format(totalLinea)}`;
            
      doc.text(consulta ? consulta.idConsulta.toString().padStart(3, '0') : '000', itemCodeX, currentY);
      doc.text(detalle.descripcion, descriptionX, currentY);
      doc.text(cantidad.toString(), quantityX, currentY);      
      doc.text(precioFormateado, priceX, currentY);      
      doc.text(totalFormateado, totalX, currentY);
            
      currentY += 20;      
    }      
            
    // TOTALES          
    const totalsY = currentY + 30;        
    doc.moveTo(350, totalsY - 10).lineTo(550, totalsY - 10).stroke();        
            
    const subtotal = detallesConConsultas.reduce((sum, detalle) => {
      return sum + (detalle.totalLinea || 0);
    }, 0);   
            
    const totalDescuentos = descuentos.reduce((sum, desc) => sum + Number(desc.monto || 0), 0);        
    const subtotalConDescuento = subtotal - totalDescuentos;        
    const isv = subtotalConDescuento * 0.15;        
    const totalFinal = subtotalConDescuento + isv;        
            
    doc.fontSize(10).font('Helvetica-Bold');        
    doc.text('SUBTOTAL:', 400, totalsY);        
    doc.text(`L. ${formatearNumero.format(subtotal)}`, 480, totalsY);        
            
    if (totalDescuentos > 0) {        
      doc.text('DESCUENTOS:', 400, totalsY + 15);        
      doc.text(`L. ${formatearNumero.format(totalDescuentos)}`, 480, totalsY + 15);        
              
      doc.text('ISV (15%):', 400, totalsY + 30);        
      doc.text(`L. ${formatearNumero.format(isv)}`, 480, totalsY + 30);        
              
      doc.fontSize(12).font('Helvetica-Bold');        
      doc.text('TOTAL:', 400, totalsY + 50);        
      doc.text(`L. ${formatearNumero.format(totalFinal)}`, 480, totalsY + 50);        
    } else {        
      doc.text('ISV (15%):', 400, totalsY + 15);        
      doc.text(`L. ${formatearNumero.format(isv)}`, 480, totalsY + 15);        
              
      doc.fontSize(12).font('Helvetica-Bold');        
      doc.text('TOTAL:', 400, totalsY + 35);        
      doc.text(`L. ${formatearNumero.format(totalFinal)}`, 480, totalsY + 35);        
    }      
      
    // Actualizar el Total_Facturado en la factura    
    nuevaFactura.Total_Facturado = totalFinal;    
    await nuevaFactura.save({ transaction: t });  
      
    // INFORMACIÓN LEGAL
    const legalY = totalDescuentos > 0 ? totalsY + 80 : totalsY + 65;

    doc.fontSize(8).font('Helvetica')  
      .text('Esta factura es válida por 30 días', 50, legalY)  
      .text('Resolución SAR No. 45145', 50, legalY + 15)  
      .text('CAI: ACD2155QWJJ254254', 50, legalY + 30)  
      .text('Rango Autorizado: Del 00000001 al 99999999', 50, legalY + 45)  
      .text('Fecha límite de emisión: 31/12/2025', 50, legalY + 60)  
      .text('Autorización 54120', 50, legalY + 75);     
        
    // LEYENDA TERRITORIAL
    doc.fontSize(9).font('Helvetica-Bold')  
      .text('Este documento es válido en todo el territorio nacional', 50, legalY + 95);  
      
    // FIRMA Y EMPLEADO  
    doc.text('_________________________', 400, legalY + 20);  
    doc.text('Firma y Sello', 430, legalY + 35);  
    doc.fontSize(7).text(`Atendido por: ${nombreEmpleado}`, 400, legalY + 50); 
        
    doc.end();  
  
    // Guardar el nombre del archivo PDF en la factura  
    nuevaFactura.archivo_pdf = nombreArchivo;  
    await nuevaFactura.save({ transaction: t });  
  
    // 7. INCREMENTAR facturasEmitidas en el CAI activo
    const CAI = require('../../modelos/facturacion/Cai');
    await CAI.increment('facturasEmitidas', {
      where: { activo: [true, 1] },
      transaction: t
    });
    
    // 8. Confirmar transacción
    await t.commit();  
  
    res.status(201).json({  
      mensaje: 'Factura por consulta médica registrada con éxito',
      factura: nuevaFactura  
    });  
  
  } catch (error) {  
    await t.rollback();  
    console.error(error);  
    res.status(500).json({  
      mensaje: 'Error al crear factura por consulta',
      error: error.message
    });
  }
};

// Obtener estadísticas de facturación
exports.obtenerEstadisticasFacturacion = async (req, res) => {
  try {
    // Obtener todas las facturas con sus relaciones
    const facturas = await Factura.findAll({
      include: [
        {
          model: Cliente,
          as: 'cliente',
          include: [
            {
              model: Persona,
              as: 'persona'
            }
          ]
        },
        {
          model: Empleado,
          as: 'empleado',
          include: [
            {
              model: Persona,
              as: 'persona'
            }
          ]
        }
      ],
      order: [['Fecha', 'DESC']]
    });

    // Calcular estadísticas del mes actual
    const fechaActual = new Date();
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

    const facturasMes = facturas.filter(factura => {
      const fechaFactura = new Date(factura.Fecha);
      return fechaFactura >= primerDiaMes && fechaFactura <= ultimoDiaMes;
    });

    const totalMes = facturasMes.reduce((acc, factura) => acc + (factura.Total_Facturado || 0), 0);
    const emitidas = facturasMes.length;
    const pendientes = facturasMes.filter(f => f.estadoFactura === 'pendiente').length;
    const pagadas = facturasMes.filter(f => f.estadoFactura === 'cobrada').length;
    const anuladas = facturasMes.filter(f => f.estadoFactura === 'anulada').length;

    // Calcular estadísticas por tipo de facturación
    const porTipo = {
      consulta: facturasMes.filter(f => f.tipoFacturacion === 'consulta').length,
      producto: facturasMes.filter(f => f.tipoFacturacion === 'producto').length,
      servicio: facturasMes.filter(f => f.tipoFacturacion === 'servicio').length,
      mixto: facturasMes.filter(f => f.tipoFacturacion === 'mixto').length
    };

    // Obtener las últimas 10 facturas para la tabla
    const ultimasFacturas = facturas.slice(0, 10).map(factura => ({
      id: factura.idFactura,
      cliente: factura.cliente?.persona?.nombre || 'Cliente no encontrado',
      fecha: factura.Fecha,
      estado: factura.estadoFactura,
      total: factura.Total_Facturado || 0,
      tipo: factura.tipoFacturacion
    }));

    res.json({
      resumen: {
        totalMes,
        emitidas,
        pendientes,
        pagadas,
        anuladas
      },
      porTipo,
      ultimasFacturas
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de facturación:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener estadísticas de facturación', 
      error: error.message 
    });
  }
};

// All functions are already exported using exports.functionName syntax

// Obtener siguiente número de factura - LÓGICA SIMPLIFICADA
exports.obtenerSiguienteNumeroFactura = async (req, res) => {  
  try {  
    const ultimaFactura = await Factura.findOne({  
      order: [['idFactura', 'DESC']],  
      attributes: ['idFactura']  
    });  
      
    const siguienteNumero = ultimaFactura ? ultimaFactura.idFactura + 1 : 1;  
      
    res.json({ siguienteNumero });  
  } catch (error) {  
    console.error(error);  
    res.status(500).json({ mensaje: 'Error al obtener siguiente número de factura', error: error.message });  
  }  
};