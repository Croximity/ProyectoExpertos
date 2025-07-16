const express = require('express');
const { body, param, validationResult } = require('express-validator');
const empleadoController = require('../../controladores/gestion_cliente/EmpleadoController');
const router = express.Router();

// Validaciones para crear y editar empleado
const validarEmpleado = [
  body('idPersona').isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('Fecha_Registro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
];

router.post('/empleado',
  [
    body('Pnombre').isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el primer nombre'),
    body('Snombre').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el segundo nombre'),
    body('Papellido').isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el primer apellido'),
    body('Sapellido').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el segundo apellido'),
    body('correo').isEmail().withMessage('El correo debe ser válido').isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres'),
    body('DNI').isLength({ min: 13, max: 13 }).withMessage('El DNI debe tener exactamente 13 caracteres'),
    body('idPersona').isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')
      .custom(async value => {
        const Persona = require('../../modelos/seguridad/Persona');
        const existe = await Persona.findByPk(value);
        if (!existe) throw new Error('La persona asociada no existe');
        return true;
      }),
    body('Fecha_Registro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
  ],
  empleadoController.crearEmpleado
);
const { query } = require('express-validator');

router.get('/empleado',
  [
    query('Pnombre').optional().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 letras'),
    query('Papellido').optional().isLength({ min: 3 }).withMessage('El apellido debe tener al menos 3 letras'),
    (req, res, next) => {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }
      if (!req.query.Pnombre && !req.query.Papellido) {
        return res.status(400).json({ mensaje: 'Debe enviar al menos Pnombre o Papellido con mínimo 3 letras.' });
      }
      next();
    }
  ],
  empleadoController.obtenerEmpleados
);
router.get('/empleado/:id',
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
  empleadoController.obtenerEmpleadoPorId
);
router.put('/empleado/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Empleado = require('../../modelos/gestion_cliente/Empleado');
        const existe = await Empleado.findByPk(value);
        if (!existe) throw new Error('El empleado no existe');
        return true;
      }),
    body('Pnombre').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el primer nombre'),
    body('Snombre').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el segundo nombre'),
    body('Papellido').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el primer apellido'),
    body('Sapellido').optional().isLength({ min: 3, max: 50 }).withMessage('Debe escribir entre 3 - 50 caracteres para el segundo apellido'),
    body('correo').optional().isEmail().withMessage('El correo debe ser válido').isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres'),
    body('DNI').optional().isLength({ min: 13, max: 13 }).withMessage('El DNI debe tener exactamente 13 caracteres'),
    body('idPersona').optional().isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo')
      .custom(async value => {
        if (value) {
          const Persona = require('../../modelos/seguridad/Persona');
          const existe = await Persona.findByPk(value);
          if (!existe) throw new Error('La persona asociada no existe');
        }
        return true;
      }),
    body('Fecha_Registro').optional().isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
  ],
  empleadoController.editarEmpleado
);
router.delete('/empleado/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
      .custom(async value => {
        const Empleado = require('../../modelos/gestion_cliente/Empleado');
        const existe = await Empleado.findByPk(value);
        if (!existe) throw new Error('El empleado no existe');
        return true;
      })
  ],
  empleadoController.eliminarEmpleado
);

module.exports = router;
