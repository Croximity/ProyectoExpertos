const express = require('express');
const router = express.Router();
const diagnosticoController = require('../../controladores/consulta_examenes/DiagnosticoController');

/**
 * @swagger
 * /diagnostico/listar:
 *   get:
 *     summary: Listar diagnósticos
 *     tags: [Diagnostico]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de diagnósticos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Diagnostico'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * /diagnostico/guardar:
 *   post:
 *     summary: Guardar un diagnóstico
 *     tags: [Diagnostico]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Diagnostico'
 *     responses:
 *       201:
 *         description: Diagnóstico creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 * /diagnostico/editar/{id}:
 *   put:
 *     summary: Editar un diagnóstico
 *     tags: [Diagnostico]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del diagnóstico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Diagnostico'
 *     responses:
 *       200:
 *         description: Diagnóstico actualizado exitosamente
 *       404:
 *         description: Diagnóstico no encontrado
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 * /diagnostico/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un diagnóstico
 *     tags: [Diagnostico]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del diagnóstico
 *     responses:
 *       200:
 *         description: Diagnóstico eliminado exitosamente
 *       404:
 *         description: Diagnóstico no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * /diagnostico/obtener/{id}:
 *   get:
 *     summary: Obtener diagnóstico por ID
 *     tags: [Diagnostico]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del diagnóstico
 *     responses:
 *       200:
 *         description: Diagnóstico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diagnostico'
 *       404:
 *         description: Diagnóstico no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/diagnostico/listar', diagnosticoController.listarDiagnostico);
router.post('/diagnostico/guardar', diagnosticoController.guardarDiagnostico);
router.put('/diagnostico/editar/:id', diagnosticoController.editarDiagnostico);
router.delete('/diagnostico/eliminar/:id', diagnosticoController.eliminarDiagnostico);
router.get('/diagnostico/obtener/:id', diagnosticoController.obtenerDiagnosticoPorId);

module.exports = router;