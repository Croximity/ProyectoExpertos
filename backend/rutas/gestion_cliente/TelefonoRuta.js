const express = require('express');
const { body, param, validationResult, query } = require('express-validator');
const telefonoController = require('../../controladores/gestion_cliente/TelefonoController');
const { verificarUsuario } = require('../../configuraciones/passport');
const router = express.Router();


/**
 * @swagger
 * /telefonos/telefono:
 *   post:
 *     summary: Crear un nuevo teléfono
 *     tags: [Telefonos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idPersona
 *               - Numero
 *               - Estado
 *             properties:
 *               idPersona:
 *                 type: integer
 *                 description: ID de la persona asociada al teléfono
 *                 example: 1
 *               Numero:
 *                 type: string
 *                 description: Número de teléfono (7 a 15 dígitos, debe empezar por 2 si es fax)
 *                 example: "123456789"
 *               Estado:
 *                 type: string
 *                 enum: [movil, fijo, fax]
 *                 description: Tipo de teléfono
 *                 example: "movil"
 *     responses:
 *       201:
 *         description: Teléfono creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Teléfono creado
 *                 telefono:
 *                   $ref: '#/components/schemas/Telefono'
 *       400:
 *         description: Error de validación o número/persona no válida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: La persona asociada no existe
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El número debe tener entre 7 y 15 dígitos
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al crear teléfono
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

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
  verificarUsuario,
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

/**
 * @swagger
 * /telefonos/telefono:
 *   get:
 *     summary: Obtener todos los teléfonos con filtros opcionales
 *     tags: [Telefonos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: numero
 *         schema:
 *           type: string
 *           minLength: 7
 *         required: false
 *         description: Número de teléfono para filtrar (mínimo 7 dígitos)
 *         example: "1234567"
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [movil, fijo, fax]
 *         required: false
 *         description: Tipo de teléfono para filtrar
 *         example: "movil"
 *       - in: query
 *         name: idPersona
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: ID de la persona para filtrar
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de teléfonos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Telefono'
 *       400:
 *         description: Error de validación o falta de filtros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Debe enviar al menos uno de los filtros: numero, tipo o idPersona"
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El número debe tener al menos 7 dígitos
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al obtener teléfonos
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.get('/telefono',
  verificarUsuario,
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

/**
 * @swagger
 * /telefonos/telefono/{id}:
 *   get:
 *     summary: Obtener un teléfono por ID
 *     tags: [Telefonos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del teléfono
 *         example: 1
 *     responses:
 *       200:
 *         description: Teléfono encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Telefono'
 *       404:
 *         description: Teléfono no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Teléfono no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al obtener teléfono
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.get('/telefono/:id',
  verificarUsuario,
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
  telefonoController.obtenerTelefonoPorId
);

/**
 * @swagger
 * /telefonos/telefono/{id}:
 *   put:
 *     summary: Actualizar un teléfono existente
 *     tags: [Telefonos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del teléfono
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPersona:
 *                 type: integer
 *                 description: ID de la persona asociada al teléfono (opcional)
 *                 example: 1
 *               Numero:
 *                 type: string
 *                 description: Número de teléfono (opcional, 7 a 15 dígitos, debe empezar por 2 si es fax)
 *                 example: "123456789"
 *               Estado:
 *                 type: string
 *                 enum: [movil, fijo, fax]
 *                 description: Tipo de teléfono (opcional)
 *                 example: "movil"
 *     responses:
 *       200:
 *         description: Teléfono actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Teléfono actualizado
 *                 telefono:
 *                   $ref: '#/components/schemas/Telefono'
 *       400:
 *         description: Error de validación o número/persona no válida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: La Persona asociada no existe
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El número debe tener entre 7 y 15 dígitos
 *       404:
 *         description: Teléfono no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Teléfono no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al editar teléfono
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.put('/telefono/:id',
  verificarUsuario,
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

/**
 * @swagger
 * /telefonos/telefono/{id}:
 *   delete:
 *     summary: Eliminar un teléfono
 *     tags: [Telefonos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del teléfono
 *         example: 1
 *     responses:
 *       200:
 *         description: Teléfono eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Teléfono eliminado
 *       404:
 *         description: Teléfono no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Teléfono no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al eliminar teléfono
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */

router.delete('/telefono/:id',
  verificarUsuario,
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Telefono:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del teléfono
 *           example: 1
 *         idPersona:
 *           type: integer
 *           description: ID de la persona asociada
 *           example: 1
 *         Numero:
 *           type: string
 *           description: Número de teléfono
 *           example: "123456789"
 *         Estado:
 *           type: string
 *           enum: [movil, fijo, fax]
 *           description: Tipo de teléfono
 *           example: "movil"
 */

module.exports = router;