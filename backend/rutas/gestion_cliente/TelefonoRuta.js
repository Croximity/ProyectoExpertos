const express = require('express');
const { body, param, validationResult } = require('express-validator');
const telefonoController = require('../../controladores/gestion_cliente/TelefonoController');
const router = express.Router();

// Validaciones para crear y editar teléfono
const validarTelefono = [
  body('idPersona').isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('Numero').isString().withMessage('El número debe ser un texto').matches(/^[\d]{7,15}$/).withMessage('El número debe tener entre 7 y 15 dígitos'),
  body('Estado').isIn(['movil', 'fijo', 'fax']).withMessage('El estado debe ser movil, fijo o fax'),
  body().custom(body => {
    if (body.Estado === 'fax' && (!body.Numero || !body.Numero.startsWith('2'))) {
      throw new Error('El número de fax debe empezar por 2');
    }
    return true;
  })
];

router.post('/telefono',
  [
    body('idPersona').isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')
      .custom(async value => {
        const Persona = require('../../modelos/seguridad/Persona');
        const existe = await Persona.findByPk(value);
        if (!existe) throw new Error('La persona asociada no existe');
        return true;
      }),
    body('Numero').isString().withMessage('El número debe ser un texto').matches(/^[\d]{7,15}$/).withMessage('El número debe tener entre 7 y 15 dígitos')
      .custom(async value => {
        const Telefono = require('../../modelos/gestion_cliente/Telefono');
        const existe = await Telefono.findOne({ where: { Numero: value } });
        if (existe) throw new Error('El número de teléfono ya existe');
        return true;
      }),
    body('Estado').isIn(['movil', 'fijo', 'fax']).withMessage('El estado debe ser movil, fijo o fax'),
    body().custom(body => {
      if (body.Estado === 'fax' && (!body.Numero || !body.Numero.startsWith('2'))) {
        throw new Error('El número de fax debe empezar por 2');
      }
      return true;
    })
  ],
  telefonoController.crearTelefono
);
const { query } = require('express-validator');

router.get('/telefono',
  [
    query('numero').optional().isLength({ min: 7 }).withMessage('El número debe tener al menos 7 dígitos'),
    query('tipo').optional().isIn(['movil', 'fijo', 'fax']).withMessage('El tipo debe ser movil, fijo o fax'),
    query('idPersona').optional().isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
    (req, res, next) => {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }
      if (!req.query.numero && !req.query.tipo && !req.query.idPersona) {
        return res.status(400).json({ mensaje: 'Debe enviar al menos uno de los filtros: numero, tipo o idPersona.' });
      }
      next();
    }
  ],
  telefonoController.obtenerTelefonos
);
router.get('/telefono/:id',
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
  telefonoController.obtenerTelefonoPorId
);
router.put('/telefono/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Telefono = require('../../modelos/gestion_cliente/Telefono');
        const existe = await Telefono.findByPk(value);
        if (!existe) throw new Error('El teléfono no existe');
        return true;
      }),
    body('idPersona').optional().isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')
      .custom(async value => {
        if (value) {
          const Cliente = require('../../modelos/seguridad/Persona');
          const existe = await Cliente.findByPk(value);
          if (!existe) throw new Error('La Persona asociada no existe');
        }
        return true;
      }),
    body('numero').optional().isString().withMessage('El número debe ser un texto').matches(/^\d{7,15}$/).withMessage('El número debe tener entre 7 y 15 dígitos')
      .custom(async (value, { req }) => {
        if (value) {
          const Telefono = require('../../modelos/gestion_cliente/Telefono');
          const existe = await Telefono.findOne({ where: { numero: value, id: { $ne: req.params.id } } });
          if (existe) throw new Error('El número de teléfono ya existe');
        }
        return true;
      }),
    body('tipo').optional().isIn(['movil', 'fijo', 'fax']).withMessage('El tipo debe ser movil, fijo o fax'),
    body().custom(body => {
      if (body.tipo === 'fax' && body.numero && !body.numero.startsWith('2')) {
        throw new Error('El número de fax debe empezar por 2');
      }
      return true;
    })
  ],
  telefonoController.editarTelefono
);
router.delete('/telefono/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Telefono = require('../../modelos/gestion_cliente/Telefono');
        const existe = await Telefono.findByPk(value);
        if (!existe) throw new Error('El teléfono no existe');
        return true;
      })
  ],
  telefonoController.eliminarTelefono
);

module.exports = router;