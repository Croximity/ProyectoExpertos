const express = require('express');
const router = express.Router();
const reparacionDeLentesController = require('../../controladores/consulta_examenes/ReparacionDeLentesController');

router.post('/reparacion-lentes', reparacionDeLentesController.guardarReparacionDeLentes);
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
 *     responses:
 *       201:
 *         description: Reparación de lentes creada exitosamente
 *       400:
 *         description: Error de validación
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
 *     responses:
 *       200:
 *         description: Reparación de lentes actualizada exitosamente
 *       404:
 *         description: Reparación de lentes no encontrada
 *       400:
 *         description: Error de validación
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
 *       404:
 *         description: Reparación de lentes no encontrada
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
 *       404:
 *         description: Reparación de lentes no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/reparacion-lentes/listar', reparacionDeLentesController.listarReparacionDeLentes);
router.post('/reparacion-lentes/guardar', reparacionDeLentesController.guardarReparacionDeLentes);
router.put('/reparacion-lentes/editar/:id', reparacionDeLentesController.editarReparacionDeLentes);
router.delete('/reparacion-lentes/eliminar/:id', reparacionDeLentesController.eliminarReparacionDeLentes);
router.get('/reparacion-lentes/obtener/:id', reparacionDeLentesController.obtenerReparacionDeLentesPorId);

module.exports = router;