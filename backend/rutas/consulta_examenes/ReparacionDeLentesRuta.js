const express = require('express');
const router = express.Router();
const reparacionDeLentesController = require('../../controladores/consulta_examenes/ReparacionDeLentesController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * /reparacion-lentes/listar:
 *   get:
 *     summary: Listar reparaciones de lentes (con filtros opcionales)
 *     tags: [ReparacionDeLentes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idConsulta
 *         schema:
 *           type: integer
 *         description: Filtrar por idConsulta
 *       - in: query
 *         name: tipoReparacion
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de reparación
 *       - in: query
 *         name: costoMin
 *         schema:
 *           type: number
 *           format: float
 *         description: Costo mínimo
 *       - in: query
 *         name: costoMax
 *         schema:
 *           type: number
 *           format: float
 *         description: Costo máximo
 *     responses:
 *       200:
 *         description: Lista de reparaciones de lentes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReparacionDeLentes'
 *             example:
 *               - id: 1
 *                 idConsulta: 10
 *                 tipoReparacion: "Cambio de micas"
 *                 costo: 150.00
 *                 fecha: "2025-07-17"
 *               - id: 2
 *                 idConsulta: 11
 *                 tipoReparacion: "Ajuste de montura"
 *                 costo: 80.00
 *                 fecha: "2025-07-18"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * /reparacion-lentes/guardar:
 *   post:
 *     summary: Guardar una reparación de lentes
 *     tags: [ReparacionDeLentes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReparacionDeLentes'
 *           example:
 *             idConsulta: 10
 *             Tipo_Reparacion: "Cambio de micas"
 *             Costo: 150.00
 *             fecha: "2025-07-17"
 *     responses:
 *       201:
 *         description: Reparación de lentes creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Reparación de lentes creada
 *                 reparacionDeLentes:
 *                   $ref: '#/components/schemas/ReparacionDeLentes'
 *             example:
 *               mensaje: Reparación de lentes creada
 *               reparacionDeLentes:
 *                 id: 1
 *                 idConsulta: 10
 *                 tipoReparacion: "Cambio de micas"
 *                 costo: 150.00
 *                 fecha: "2025-07-17"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 * /reparacion-lentes/editar/{id}:
 *   put:
 *     summary: Editar una reparación de lentes
 *     tags: [ReparacionDeLentes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reparación de lentes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReparacionDeLentes'
 *           example:
 *             idConsulta: 10
 *             tipoReparacion: "Ajuste de montura"
 *             costo: 80.00
 *             fecha: "2025-07-18"
 *     responses:
 *       200:
 *         description: Reparación de lentes actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Reparación de lentes actualizada
 *                 reparacionDeLentes:
 *                   $ref: '#/components/schemas/ReparacionDeLentes'
 *             example:
 *               mensaje: Reparación de lentes actualizada
 *               reparacionDeLentes:
 *                 id: 1
 *                 idConsulta: 10
 *                 tipoReparacion: "Ajuste de montura"
 *                 costo: 80.00
 *                 fecha: "2025-07-18"
 *       404:
 *         description: Reparación de lentes no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Reparación de lentes no encontrada
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 * /reparacion-lentes/eliminar/{id}:
 *   delete:
 *     summary: Eliminar una reparación de lentes
 *     tags: [ReparacionDeLentes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reparación de lentes
 *     responses:
 *       200:
 *         description: Reparación de lentes eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Reparación de lentes eliminada
 *             example:
 *               mensaje: Reparación de lentes eliminada
 *       404:
 *         description: Reparación de lentes no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Reparación de lentes no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * /reparacion-lentes/obtener/{id}:
 *   get:
 *     summary: Obtener reparación de lentes por ID
 *     tags: [ReparacionDeLentes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reparación de lentes
 *     responses:
 *       200:
 *         description: Reparación de lentes encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReparacionDeLentes'
 *             example:
 *               id: 1
 *               idConsulta: 10
 *               tipoReparacion: "Cambio de micas"
 *               costo: 150.00
 *               fecha: "2025-07-17"
 *       404:
 *         description: Reparación de lentes no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Reparación de lentes no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *
 * components:
 *   schemas:
 *     ReparacionDeLentes:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         idConsulta:
 *           type: integer
 *           example: 10
 *         tipoReparacion:
 *           type: string
 *           example: Cambio de micas
 *         costo:
 *           type: number
 *           format: float
 *           example: 150.00
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2025-07-17"
 */

router.get('/reparacion-lentes/listar', verificarUsuario, reparacionDeLentesController.listarReparacionDeLentes);
router.post('/reparacion-lentes/guardar', verificarUsuario, reparacionDeLentesController.guardarReparacionDeLentes);
router.put('/reparacion-lentes/editar/:id', verificarUsuario, reparacionDeLentesController.editarReparacionDeLentes);
router.delete('/reparacion-lentes/eliminar/:id', verificarUsuario, reparacionDeLentesController.eliminarReparacionDeLentes);
router.get('/reparacion-lentes/obtener/:id', verificarUsuario, reparacionDeLentesController.obtenerReparacionDeLentesPorId);

module.exports = router;