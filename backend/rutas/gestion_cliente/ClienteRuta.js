const express = require('express');
const { body, param, validationResult } = require('express-validator');
const clienteController = require('../../controladores/gestion_cliente/ClienteController');
const router = express.Router();

// Validaciones para crear y editar cliente
const validarCliente = [
  body('idPersona').isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('fechaRegistro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
];

// Validaciones POST (crear)
router.post('/cliente',
  [
    body('Pnombre').isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el primer nombre'),
    body('Snombre').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el segundo nombre'),
    body('Papellido').isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el primer apellido'),
    body('Sapellido').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el segundo apellido'),
    body('correo').isEmail().withMessage('El correo debe ser válido').isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres')
      .custom(async value => {
        const Cliente = require('../../modelos/gestion_cliente/Cliente');
        const existe = await Cliente.findOne({ where: { correo: value } });
        if (existe) throw new Error('El correo ya está registrado');
        return true;
      }),
    body('DNI').isLength({ min: 13, max: 13 }).withMessage('El DNI debe tener exactamente 13 caracteres')
      .custom(async value => {
        const Cliente = require('../../modelos/gestion_cliente/Cliente');
        const existe = await Cliente.findOne({ where: { DNI: value } });
        if (existe) throw new Error('El DNI ya está registrado');
        return true;
      }),
    body('idPersona').isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')
      .custom(async value => {
        const Persona = require('../../modelos/seguridad/Persona');
        const existe = await Persona.findByPk(value);
        if (!existe) throw new Error('La persona asociada no existe');
        return true;
      }),
    body('fechaRegistro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
  ],
  clienteController.crearCliente
);
const { query } = require('express-validator');

router.get('/cliente',
  [
    query('Pnombre').optional().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 letras'),
    query('Papellido').optional().isLength({ min: 3 }).withMessage('El apellido debe tener al menos 3 letras'),
    (req, res, next) => {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }
      // Si no se envía ningún filtro, rechazar
      if (!req.query.Pnombre && !req.query.Papellido) {
        return res.status(400).json({ mensaje: 'Debe enviar al menos Pnombre o Papellido con mínimo 3 letras.' });
      }
      next();
    }
  ],
  clienteController.obtenerClientes
);
router.get('/cliente/:id',
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
  clienteController.obtenerClientePorId
);
// Validaciones PUT (editar)
router.put('/cliente/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Cliente = require('../../modelos/gestion_cliente/Cliente');
        const existe = await Cliente.findByPk(value);
        if (!existe) throw new Error('El cliente no existe');
        return true;
      }),
    body('Pnombre').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el primer nombre'),
    body('Snombre').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el segundo nombre'),
    body('Papellido').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el primer apellido'),
    body('Sapellido').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el segundo apellido'),
    body('correo').optional().isEmail().withMessage('El correo debe ser válido').isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres')
      .custom(async (value, { req }) => {
        if (value) {
          const Cliente = require('../../modelos/gestion_cliente/Cliente');
          const existe = await Cliente.findOne({ where: { correo: value, id: { $ne: req.params.id } } });
          if (existe) throw new Error('El correo ya está registrado');
        }
        return true;
      }),
    body('DNI').optional().isLength({ min: 13, max: 13 }).withMessage('El DNI debe tener exactamente 13 caracteres')
      .custom(async (value, { req }) => {
        if (value) {
          const Cliente = require('../../modelos/gestion_cliente/Cliente');
          const existe = await Cliente.findOne({ where: { DNI: value, id: { $ne: req.params.id } } });
          if (existe) throw new Error('El DNI ya está registrado');
        }
        return true;
      }),
    body('idPersona').optional().isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')
      .custom(async value => {
        if (value) {
          const Persona = require('../../modelos/seguridad/Persona');
          const existe = await Persona.findByPk(value);
          if (!existe) throw new Error('La persona asociada no existe');
        }
        return true;
      }),
    body('fechaRegistro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
  ],
  clienteController.editarCliente
);
// Validación DELETE
router.delete('/cliente/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Cliente = require('../../modelos/gestion_cliente/Cliente');
        const existe = await Cliente.findByPk(value);
        if (!existe) throw new Error('El cliente no existe');
        return true;
      })
  ],
  clienteController.eliminarCliente
);

module.exports = router;