const Factura = require('../../modelos/facturacion/Factura');
const db = require('../../configuraciones/db');
const FacturaDetalle = require('../../modelos/facturacion/FacturaDetalle');
const DetalleDescuento = require('../../modelos/facturacion/DetalleDescuento');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

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
// Crear una factura completa (con detalles y descuentos)

exports.crearFacturaCompleta = async (req, res) => {
  const t = await db.transaction();

  try {
    let { factura, detalles, descuentos } = req.body;

    // Si no vienen descuentos, asignar uno por defecto para evitar error "no iterable"
    descuentos = descuentos && descuentos.length > 0
      ? descuentos
      : [{ idDescuento: 0, monto: 0 }];

    // 1. Crear factura
    const nuevaFactura = await Factura.create(factura, { transaction: t });

    // 2. Agregar ID de factura a cada detalle
    for (let d of detalles) {
      d.idFactura = nuevaFactura.idFactura;
    }

    // 3. Crear detalles
    await FacturaDetalle.bulkCreate(detalles, { transaction: t });

    // 4. Agregar ID de factura a cada descuento
    for (let d of descuentos) {
      d.idFactura = nuevaFactura.idFactura;
    }

    // 5. Crear descuentos
    await DetalleDescuento.bulkCreate(descuentos, { transaction: t });

    // --- Generar PDF de la factura ---
    const nombreArchivo = `factura_${nuevaFactura.idFactura}.pdf`;
    const rutaPDF = path.join(__dirname, '../../uploads', nombreArchivo);

    // --- Generar PDF de la factura con formato SAR ---   
  
    // Crear el PDF con formato profesional  
    const doc = new PDFDocument({ margin: 50 });  
    doc.pipe(fs.createWriteStream(rutaPDF));  
      
    // ENCABEZADO DE LA EMPRESA  
    doc.fontSize(16).font('Helvetica-Bold')  
      .text('ÓPTICA [NOMBRE DE TU EMPRESA]', { align: 'center' });  
    doc.fontSize(10).font('Helvetica')  
      .text('RTN: [TU-RTN-AQUÍ]', { align: 'center' })  
      .text('CAI: [TU-CAI-AQUÍ]', { align: 'center' })  
      .text('Dirección: [Tu dirección completa]', { align: 'center' })  
      .text('Teléfono: [Tu teléfono] | Email: [Tu email]', { align: 'center' });  
      
    // Línea separadora  
    doc.moveTo(50, doc.y + 10).lineTo(550, doc.y + 10).stroke();  
    doc.moveDown(2);  
      
    // TÍTULO FACTURA  
    doc.fontSize(18).font('Helvetica-Bold')  
      .text('FACTURA', { align: 'center' });  
    doc.moveDown();  
      
    // INFORMACIÓN DE LA FACTURA (Lado izquierdo)  
    const facturaY = doc.y;  
    doc.fontSize(10).font('Helvetica-Bold')  
      .text('FACTURA No:', 50, facturaY)  
      .font('Helvetica')  
      .text(nuevaFactura.idFactura.toString().padStart(8, '0'), 130, facturaY);  
      
    doc.font('Helvetica-Bold')  
      .text('FECHA:', 50, facturaY + 15)  
      .font('Helvetica')  
      .text(new Date(nuevaFactura.Fecha).toLocaleDateString('es-HN'), 130, facturaY + 15);  
      
    doc.font('Helvetica-Bold')  
      .text('TIPO DOC:', 50, facturaY + 30)  
      .font('Helvetica')  
      .text(nuevaFactura.Tipo_documento || 'FACTURA', 130, facturaY + 30);  
      
    // DATOS DEL CLIENTE (Lado derecho)  
    // Aquí necesitarías obtener los datos del cliente desde la base de datos  
    doc.font('Helvetica-Bold')  
      .text('CLIENTE:', 300, facturaY)  
      .font('Helvetica')  
      .text('[Nombre del Cliente]', 350, facturaY);  
      
    doc.font('Helvetica-Bold')  
      .text('RTN/ID:', 300, facturaY + 15)  
      .font('Helvetica')  
      .text('[RTN del Cliente]', 350, facturaY + 15);  
      
    doc.font('Helvetica-Bold')  
      .text('DIRECCIÓN:', 300, facturaY + 30)  
      .font('Helvetica')  
      .text('[Dirección del Cliente]', 350, facturaY + 30);  
      
    doc.moveDown(4);  
      
    // TABLA DE PRODUCTOS/SERVICIOS  
    const tableTop = doc.y;  
    const itemCodeX = 50;  
    const descriptionX = 100;  
    const quantityX = 350;  
    const priceX = 400;  
    const totalX = 480;  
      
    // Encabezados de tabla  
    doc.fontSize(9).font('Helvetica-Bold');  
    doc.text('CÓDIGO', itemCodeX, tableTop);  
    doc.text('DESCRIPCIÓN', descriptionX, tableTop);  
    doc.text('CANT.', quantityX, tableTop);  
    doc.text('PRECIO', priceX, tableTop);  
    doc.text('TOTAL', totalX, tableTop);  
      
    // Línea bajo encabezados  
    doc.moveTo(itemCodeX, tableTop + 15).lineTo(550, tableTop + 15).stroke();  
      
    // Aquí deberías iterar sobre los detalles de la factura  
    let currentY = tableTop + 25;  
    doc.fontSize(8).font('Helvetica');  
      
    // Ejemplo de línea de producto (deberías obtener esto de FacturaDetalle)  
    doc.text('001', itemCodeX, currentY);  
    doc.text('Examen de vista completo', descriptionX, currentY);  
    doc.text('1', quantityX, currentY);  
    doc.text('L. 500.00', priceX, currentY);  
    doc.text('L. 500.00', totalX, currentY);  
      
    currentY += 20;  
      
    // TOTALES  
    const totalsY = currentY + 30;  
    doc.moveTo(350, totalsY - 10).lineTo(550, totalsY - 10).stroke();  
      
    doc.fontSize(10).font('Helvetica-Bold');  
    doc.text('SUBTOTAL:', 400, totalsY);  
    doc.text('L. 500.00', 480, totalsY);  
      
    doc.text('ISV (15%):', 400, totalsY + 15);  
    doc.text('L. 75.00', 480, totalsY + 15);  
      
    doc.fontSize(12).font('Helvetica-Bold');  
    doc.text('TOTAL:', 400, totalsY + 35);  
    doc.text(`L. ${nuevaFactura.Total_Facturado}`, 480, totalsY + 35);  
      
    // INFORMACIÓN LEGAL  
    doc.fontSize(8).font('Helvetica')  
      .text('Esta factura es válida por 30 días', 50, totalsY + 80)  
      .text('Resolución SAR No. [Tu resolución]', 50, totalsY + 95)  
      .text('Del [fecha inicio] al [fecha fin]', 50, totalsY + 110)  
      .text('Autorización [número autorización]', 50, totalsY + 125);  
      
    // FIRMA  
    doc.text('_________________________', 400, totalsY + 100);  
    doc.text('Firma y Sello', 430, totalsY + 115);  
      
    doc.end();

// --------------------------------------------------------------

    // Guardar el nombre del archivo PDF en la factura
    nuevaFactura.archivo_pdf = nombreArchivo;
    await nuevaFactura.save({ transaction: t });

    // 6. Confirmar transacción
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

