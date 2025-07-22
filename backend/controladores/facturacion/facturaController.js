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
      
    // 2. Agregar ID de factura a cada detalle (sin validar idProductoAtributo)  
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
      
    // Obtener productos directamente del modelo ProductoModel  
    const ProductoModel = require('../../modelos/productos/ProductoModel');        
    const detallesConProductos = await Promise.all(          
      detalles.map(async (detalle) => {          
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
      .text('FACTURA', { align: 'center' });        
    doc.moveDown();        
            
    // INFORMACIÓN DE LA FACTURA (Lado izquierdo) - MEJORADA      
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
      .font('Helvetica')      
      .text(nuevaFactura.Tipo_documento || 'FACTURA', 130, facturaY + 30);      
          
    // FECHA DE VENCIMIENTO DEL CAI      
    doc.font('Helvetica-Bold')      
      .text('VENCE CAI:', 50, facturaY + 45)      
      .font('Helvetica')      
      .text('31/12/2025', 130, facturaY + 45);      
          
    // DATOS DEL EMPLEADO (Lado izquierdo, debajo de info factura)      
    const empleadoPersona = empleado?.persona;      
    const nombreEmpleado = empleadoPersona ?       
      `${empleadoPersona.Pnombre} ${empleadoPersona.Snombre || ''} ${empleadoPersona.Papellido} ${empleadoPersona.Sapellido || ''}`.trim() : 'N/A';      
          
    doc.font('Helvetica-Bold')      
      .text('ATENDIDO POR:', 50, facturaY + 65)      
      .font('Helvetica')      
      .text(nombreEmpleado, 130, facturaY + 65);      
          
    // DATOS DEL CLIENTE (Lado derecho) - MEJORADOS      
    const clientePersona = cliente?.persona;      
    const nombreCliente = clientePersona ?       
      `${clientePersona.Pnombre} ${clientePersona.Snombre || ''} ${clientePersona.Papellido} ${clientePersona.Sapellido || ''}`.trim() : 'N/A';      
          
    doc.font('Helvetica-Bold')      
      .text('CLIENTE:', 300, facturaY)      
      .font('Helvetica')      
      .text(nombreCliente, 350, facturaY);      
          
    // RTN DEL CLIENTE (SI APLICA)      
    const rtnCliente = clientePersona?.DNI;      
    const tieneRTN = rtnCliente && rtnCliente.length >= 13;      
          
    doc.font('Helvetica-Bold')      
      .text(tieneRTN ? 'RTN:' : 'ID:', 300, facturaY + 15)      
      .font('Helvetica')      
      .text(rtnCliente || 'N/A', 350, facturaY + 15);      
          
    doc.font('Helvetica-Bold')      
      .text('DIRECCIÓN:', 300, facturaY + 30)      
      .font('Helvetica')      
      .text(clientePersona ? (clientePersona.Direccion || 'N/A') : 'N/A', 350, facturaY + 30);      
          
    doc.font('Helvetica-Bold')      
      .text('EMAIL:', 300, facturaY + 45)      
      .font('Helvetica')      
      .text(clientePersona ? (clientePersona.correo || 'N/A') : 'N/A', 350, facturaY + 45);      
          
    doc.moveDown(6);        
            
    // TABLA DE PRODUCTOS/SERVICIOS        
    const tableTop = doc.y;        
    const itemCodeX = 50;        
    const descriptionX = 120;        
    const quantityX = 320;        
    const priceX = 380;        
    const totalX = 480;        
            
    // Encabezados de tabla        
    doc.fontSize(9).font('Helvetica-Bold');        
    doc.text('CÓDIGO', itemCodeX, tableTop);        
    doc.text('DESCRIPCIÓN', descriptionX, tableTop);        
    doc.text('CANT.', quantityX, tableTop);        
    doc.text('P. UNIT.', priceX, tableTop);        
    doc.text('TOTAL', totalX, tableTop);        
            
    // Línea bajo encabezados        
    doc.moveTo(itemCodeX, tableTop + 15).lineTo(550, tableTop + 15).stroke();        
            
    // ITERAR SOBRE LOS DETALLES REALES DE LA FACTURA      
    let currentY = tableTop + 25;        
    doc.fontSize(8).font('Helvetica');        
            
    for (let i = 0; i < detallesConProductos.length; i++) {      
      const detalle = detallesConProductos[i];      
      const producto = detalle.producto;      
            
      // Validación defensiva para precios usando Intl.NumberFormat    
      const precioReal = Number(producto?.precioVenta || detalle.precioUnitario || 0);    
      const cantidad = Number(detalle.cantidad || 0);    
      const impuestoProducto = Number(producto?.impuesto || 0);    
          
      // Formatear precios usando Intl.NumberFormat    
      const precioFormateado = `L. ${formatearNumero.format(precioReal)}`;    
      const totalLinea = `L. ${formatearNumero.format(cantidad * precioReal)}`;    
            
      doc.text(producto ? producto.idProducto.toString().padStart(3, '0') : (detalle.idProducto || '000').toString().padStart(3, '0'), itemCodeX, currentY);      
      doc.text(producto ? producto.Nombre : 'Producto', descriptionX, currentY);      
      doc.text(cantidad.toString(), quantityX, currentY);      
      doc.text(precioFormateado, priceX, currentY);      
      doc.text(totalLinea, totalX, currentY);      
            
      currentY += 20;      
    }      
            
    // TOTALES          
    const totalsY = currentY + 30;        
    doc.moveTo(350, totalsY - 10).lineTo(550, totalsY - 10).stroke();        
            
    // Calcular subtotal con validación usando Intl.NumberFormat      
    const subtotal = detallesConProductos.reduce((sum, detalle) => {        
      const producto = detalle.producto;        
      const precioReal = Number(producto?.precioVenta || detalle.precioUnitario || 0);      
      const cantidad = Number(detalle.cantidad || 0);      
      return sum + (cantidad * precioReal);        
    }, 0);   
            
    const totalDescuentos = descuentos.reduce((sum, desc) => sum + Number(desc.monto || 0), 0);        
    const subtotalConDescuento = subtotal - totalDescuentos;        
            
    // Calcular ISV sobre el subtotal con descuentos (15% estándar en Honduras)        
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
      
    // INFORMACIÓN LEGAL COMPLETA - SAR        
    const legalY = totalDescuentos > 0 ? totalsY + 80 : totalsY + 65;

    doc.fontSize(8).font('Helvetica')  
      .text('Esta factura es válida por 30 días', 50, legalY)  
      .text('Resolución SAR No. 45145', 50, legalY + 15)  
      .text('CAI: ACD2155QWJJ254254', 50, legalY + 30)  
      .text('Rango Autorizado: Del 00000001 al 99999999', 50, legalY + 45)  
      .text('Fecha límite de emisión: 31/12/2025', 50, legalY + 60)  
      .text('Autorización 54120', 50, legalY + 75);     
        
    // LEYENDA TERRITORIAL OBLIGATORIA  
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