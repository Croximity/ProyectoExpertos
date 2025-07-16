const express = require('express');
const { body, param, validationResult } = require('express-validator');
const consultaController = require('../../controladores/gestion_cliente/ConsultaController');
const router = express.Router();

// Validaciones para crear y editar consulta
const validarConsulta = [
  body('idCliente').isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo'),
  body('Fecha_consulta').isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
  body('Motivo_consulta').isString().withMessage('El motivo debe ser un texto').isLength({ min: 5, max: 255 }).withMessage('El motivo debe tener entre 5 y 255 caracteres'),
  body('Motivo_consulta').custom(motivo => {
    if (/^\d+$/.test(motivo)) {
      throw new Error('El motivo no puede ser solo números');
    }
    return true;
  })
];

router.post('/consulta',
  [
    body('idCliente').isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo')
      .custom(async value => {
        const Cliente = require('../../modelos/gestion_cliente/Cliente');
        const existe = await Cliente.findByPk(value);
        if (!existe) throw new Error('El cliente asociado no existe');
        return true;
      }),
    body('Empleado_idEmpleado').isInt({ min: 1 }).withMessage('El Empleado_idEmpleado debe ser un número entero positivo')
      .custom(async value => {
        const Empleado = require('../../modelos/gestion_cliente/Empleado');
        const existe = await Empleado.findByPk(value);
        if (!existe) throw new Error('El empleado asociado no existe');
        return true;
      }),
    body('Fecha_consulta').isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
    body('Motivo_consulta').isString().withMessage('El motivo debe ser un texto').isLength({ min: 5, max: 255 }).withMessage('El motivo debe tener entre 5 y 255 caracteres')
      .custom(motivo => {
        if (/^\d+$/.test(motivo)) {
          throw new Error('El motivo no puede ser solo números');
        }
        return true;
      })
  ],
  consultaController.crearConsulta
);
const { query } = require('express-validator');

router.get('/consulta',
  [
    query('Motivo_consulta').optional().isLength({ min: 3 }).withMessage('El motivo debe tener al menos 3 letras'),
    query('desde').optional().isISO8601().withMessage('La fecha desde debe tener un formato válido (YYYY-MM-DD)'),
    query('hasta').optional().isISO8601().withMessage('La fecha hasta debe tener un formato válido (YYYY-MM-DD)'),
    query('idCliente').optional().isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo'),
    query('Empleado_idEmpleado').optional().isInt({ min: 1 }).withMessage('El Empleado_idEmpleado debe ser un número entero positivo'),
    (req, res, next) => {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }
      if (!req.query.Motivo_consulta && !req.query.desde && !req.query.hasta && !req.query.idCliente && !req.query.Empleado_idEmpleado) {
        return res.status(400).json({ mensaje: 'Debe enviar al menos un filtro: Motivo_consulta, desde, hasta, idCliente o Empleado_idEmpleado.' });
      }
      next();
    }
  ],
  consultaController.obtenerConsultas
);
router.get('/consulta/:id',
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
  consultaController.obtenerConsultaPorId
);
router.put('/consulta/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Consulta = require('../../modelos/gestion_cliente/Consulta');
        const existe = await Consulta.findByPk(value);
        if (!existe) throw new Error('La consulta no existe');
        return true;
      }),
    body('idCliente').optional().isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo')
      .custom(async value => {
        if (value) {
          const Cliente = require('../../modelos/gestion_cliente/Cliente');
          const existe = await Cliente.findByPk(value);
          if (!existe) throw new Error('El cliente asociado no existe');
        }
        return true;
      }),
    body('Empleado_idEmpleado').optional().isInt({ min: 1 }).withMessage('El Empleado_idEmpleado debe ser un número entero positivo')
      .custom(async value => {
        if (value) {
          const Empleado = require('../../modelos/gestion_cliente/Empleado');
          const existe = await Empleado.findByPk(value);
          if (!existe) throw new Error('El empleado asociado no existe');
        }
        return true;
      }),
    body('Fecha_consulta').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
    body('Motivo_consulta').optional().isString().withMessage('El motivo debe ser un texto').isLength({ min: 5, max: 255 }).withMessage('El motivo debe tener entre 5 y 255 caracteres')
      .custom(motivo => {
        if (motivo && /^\d+$/.test(motivo)) {
          throw new Error('El motivo no puede ser solo números');
        }
        return true;
      })
  ],
  consultaController.editarConsulta
);
router.delete('/consulta/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Consulta = require('../../modelos/gestion_cliente/Consulta');
        const existe = await Consulta.findByPk(value);
        if (!existe) throw new Error('La consulta no existe');
        return true;
      })
  ],
  consultaController.eliminarConsulta
);

module.exports = router;