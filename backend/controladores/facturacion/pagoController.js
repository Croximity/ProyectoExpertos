const Pago = require('../../modelos/facturacion/Pago');
const Factura = require('../../modelos/facturacion/Factura');
const Cliente = require('../../modelos/gestion_cliente/Cliente');
const Persona = require('../../modelos/seguridad/Persona');
const FormaPago = require('../../modelos/facturacion/FormaPago');
const { body, validationResult } = require('express-validator');

// Validaciones para crear pago
exports.validarCrearPago = [
  body('idFactura')
    .notEmpty().withMessage('idFactura es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo'),
  
  body('monto')
    .notEmpty().withMessage('El monto es obligatorio')
    .isFloat({ gt: 0 }).withMessage('El monto debe ser un número positivo'),
  
  body('idFormaPago')
    .notEmpty().withMessage('idFormaPago es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo'),
  
  body('fechaPago')
    .optional()
    .isISO8601().withMessage('Debe ser una fecha válida'),
  
  body('observaciones')
    .optional()
    .isString().withMessage('Las observaciones deben ser texto')
    .isLength({ max: 500 }).withMessage('Máximo 500 caracteres')
];

// Middleware para manejar errores
exports.manejarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

// Crear un nuevo pago
exports.crearPago = async (req, res) => {
  try {
    const { idFactura, monto, idFormaPago, fechaPago, observaciones } = req.body;

    // Verificar que la factura existe y no está anulada
    const factura = await Factura.findByPk(idFactura);
    if (!factura) {
      return res.status(404).json({ mensaje: 'Factura no encontrada' });
    }

    if (factura.estadoFactura === 'anulada') {
      return res.status(400).json({ mensaje: 'No se puede registrar pago en una factura anulada' });
    }

    // Calcular saldo pendiente de la factura
    const pagosAnteriores = await Pago.sum('monto', {
      where: {
        idFactura: idFactura,
        estado: 'activo'
      }
    });

    const saldoPendiente = factura.Total_Facturado - (pagosAnteriores || 0);

    if (monto > saldoPendiente) {
      return res.status(400).json({ 
        mensaje: `El monto excede el saldo pendiente. Saldo: L ${saldoPendiente.toFixed(2)}` 
      });
    }

    // Crear el pago
    const nuevoPago = await Pago.create({
      idFactura,
      monto,
      idFormaPago,
      fechaPago: fechaPago || new Date(),
      observaciones
    });

    // Actualizar estado de la factura si está completamente pagada
    if (monto === saldoPendiente) {
      factura.estadoFactura = 'cobrada';
      await factura.save();
    }

    res.status(201).json({ 
      mensaje: 'Pago registrado correctamente', 
      pago: nuevoPago,
      saldoRestante: saldoPendiente - monto
    });

  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({ mensaje: 'Error al registrar el pago', error: error.message });
  }
};

// Obtener todos los pagos
exports.obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      include: [
        {
          model: Factura,
          as: 'factura',
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
            }
          ]
        },
        {
          model: FormaPago,
          as: 'formaPago'
        }
      ],
      order: [['fechaPago', 'DESC']]
    });

    res.json({ pagos });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ mensaje: 'Error al obtener pagos', error: error.message });
  }
};

// Obtener pagos por factura
exports.obtenerPagosPorFactura = async (req, res) => {
  try {
    const { idFactura } = req.params;

    const pagos = await Pago.findAll({
      where: { idFactura },
      include: [
        {
          model: FormaPago,
          as: 'formaPago'
        }
      ],
      order: [['fechaPago', 'DESC']]
    });

    res.json({ pagos });
  } catch (error) {
    console.error('Error al obtener pagos de la factura:', error);
    res.status(500).json({ mensaje: 'Error al obtener pagos de la factura', error: error.message });
  }
};

// Obtener pago por ID
exports.obtenerPagoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const pago = await Pago.findByPk(id, {
      include: [
        {
          model: Factura,
          as: 'factura',
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
            }
          ]
        },
        {
          model: FormaPago,
          as: 'formaPago'
        }
      ]
    });

    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }

    res.json({ pago });
  } catch (error) {
    console.error('Error al obtener pago:', error);
    res.status(500).json({ mensaje: 'Error al obtener pago', error: error.message });
  }
};

// Anular un pago
exports.anularPago = async (req, res) => {
  try {
    const { id } = req.params;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }

    if (pago.estado === 'anulado') {
      return res.status(400).json({ mensaje: 'El pago ya está anulado' });
    }

    pago.estado = 'anulado';
    await pago.save();

    // Recalcular estado de la factura
    const factura = await Factura.findByPk(pago.idFactura);
    if (factura) {
      const pagosActivos = await Pago.sum('monto', {
        where: {
          idFactura: pago.idFactura,
          estado: 'activo'
        }
      });

      if (pagosActivos < factura.Total_Facturado) {
        factura.estadoFactura = 'activa';
        await factura.save();
      }
    }

    res.json({ mensaje: 'Pago anulado correctamente', pago });
  } catch (error) {
    console.error('Error al anular pago:', error);
    res.status(500).json({ mensaje: 'Error al anular pago', error: error.message });
  }
};
