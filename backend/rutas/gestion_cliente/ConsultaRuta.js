const express = require('express');
const { body, param, validationResult, query } = require('express-validator');
const consultaController = require('../../controladores/gestion_cliente/ConsultaController');
const { verificarUsuario } = require('../../configuraciones/passport');
const router = express.Router();


/**
 * @swagger
 * /consultas/consulta:
 *   post:
 *     summary: Crear una nueva consulta
 *     tags: [Consultas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idCliente
 *               - idEmpleado
 *               - Fecha_consulta
 *               - Motivo_consulta
 *             properties:
 *               idCliente:
 *                 type: integer
 *                 description: ID del cliente asociado a la consulta
 *                 example: 1
 *               idEmpleado:
 *                 type: integer
 *                 description: ID del empleado asociado a la consulta
 *                 example: 1
 *               Fecha_consulta:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la consulta
 *                 example: "2025-07-16"
 *               Motivo_consulta:
 *                 type: string
 *                 description: Motivo de la consulta (entre 5 y 255 caracteres, no solo números)
 *                 example: "Consulta por problemas técnicos"
 *     responses:
 *       201:
 *         description: Consulta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Consulta creada
 *                 consulta:
 *                   $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El idCliente debe ser un número entero positivo
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al crear consulta
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */


router.post('/consulta',
  verificarUsuario,
  [
    body('idCliente').isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo')
      .custom(async value => {
        const Cliente = require('../../modelos/gestion_cliente/Cliente');
        const existe = await Cliente.findByPk(value);
        if (!existe) throw new Error('El cliente asociado no existe');
        return true;
      }),
    body('idEmpleado').isInt({ min: 1 }).withMessage('El Empleado_idEmpleado debe ser un número entero positivo')
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

/**
 * @swagger
 * /consultas/consulta:
 *   get:
 *     summary: Obtener todas las consultas con filtros opcionales
 *     tags: [Consultas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: Motivo_consulta
 *         schema:
 *           type: string
 *           minLength: 3
 *         required: false
 *         description: Motivo de la consulta para filtrar (mínimo 3 caracteres)
 *         example: Problema
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha inicial para filtrar consultas
 *         example: "2025-07-01"
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha final para filtrar consultas
 *         example: "2025-07-31"
 *       - in: query
 *         name: idCliente
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: ID del cliente para filtrar
 *         example: 1
 *       - in: query
 *         name: idEmpleado
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: ID del empleado para filtrar
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de consultas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: Error de validación o falta de filtros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Debe enviar al menos un filtro: Motivo_consulta, desde, hasta, idCliente o Empleado_idEmpleado"
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El motivo debe tener al menos 3 letras
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al obtener consultas
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */
router.get('/consulta',
  verificarUsuario,
  [
    query('Motivo_consulta').optional().isLength({ min: 3 }).withMessage('El motivo debe tener al menos 3 letras'),
    query('desde').optional().isISO8601().withMessage('La fecha desde debe tener un formato válido (YYYY-MM-DD)'),
    query('hasta').optional().isISO8601().withMessage('La fecha hasta debe tener un formato válido (YYYY-MM-DD)'),
    query('idCliente').optional().isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo'),
    query('idEmpleado').optional().isInt({ min: 1 }).withMessage('El Empleado_idEmpleado debe ser un número entero positivo'),
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

/**
 * @swagger
 * /consultas/consulta/{id}:
 *   get:
 *     summary: Obtener una consulta por ID
 *     tags: [Consultas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la consulta
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consulta'
 *       404:
 *         description: Consulta no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Consulta no encontrada
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al obtener consulta
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.get('/consulta/:id',
  verificarUsuario,
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
  consultaController.obtenerConsultaPorId
);

/**
 * @swagger
 * /consultas/consulta/{id}:
 *   put:
 *     summary: Actualizar una consulta existente
 *     tags: [Consultas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la consulta
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idCliente:
 *                 type: integer
 *                 description: ID del cliente asociado a la consulta (opcional)
 *                 example: 1
 *               idEmpleado:
 *                 type: integer
 *                 description: ID del empleado asociado a la consulta (opcional)
 *                 example: 1
 *               Fecha_consulta:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la consulta (opcional)
 *                 example: "2025-07-16"
 *               Motivo_consulta:
 *                 type: string
 *                 description: Motivo de la consulta (opcional, entre 5 y 255 caracteres, no solo números)
 *                 example: "Consulta por problemas técnicos"
 *     responses:
 *       200:
 *         description: Consulta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Consulta actualizada
 *                 consulta:
 *                   $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El idCliente debe ser un número entero positivo
 *       404:
 *         description: Consulta no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Consulta no encontrada
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al editar consulta
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.put('/consulta/:id',
  verificarUsuario,
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
    body('idEmpleado').optional().isInt({ min: 1 }).withMessage('El Empleado_idEmpleado debe ser un número entero positivo')
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

/**
 * @swagger
 * /consultas/consulta/{id}:
 *   delete:
 *     summary: Eliminar una consulta
 *     tags: [Consultas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la consulta
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Consulta eliminada
 *       404:
 *         description: Consulta no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Consulta no encontrada
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al eliminar consulta
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.delete('/consulta/:id',
  verificarUsuario,
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Consulta:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la consulta
 *           example: 1
 *         idCliente:
 *           type: integer
 *           description: ID del cliente asociado
 *           example: 1
 *         idEmpleado:
 *           type: integer
 *           description: ID del empleado asociado
 *           example: 1
 *         Fecha_consulta:
 *           type: string
 *           format: date
 *           description: Fecha de la consulta
 *           example: "2025-07-16"
 *         Motivo_consulta:
 *           type: string
 *           description: Motivo de la consulta
 *           example: "Consulta por problemas técnicos"
 */
module.exports = router;