const express = require('express');
const router = express.Router();
const tipoEnfermedadController = require('../../controladores/consulta_examenes/TipoEnfermedadController');

router.post('/tipo-enfermedad', tipoEnfermedadController.guardarTipoEnfermedad);
/**
 * @swagger
 * /tipo-enfermedad/listar:
 *   get:
 *     summary: Listar tipos de enfermedad (con filtro opcional por nombre)
 *     tags: [TipoEnfermedad]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre (búsqueda parcial)
 *     responses:
 *       200:
 *         description: Lista de tipos de enfermedad obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoEnfermedad'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * /tipo-enfermedad/guardar:
 *   post:
 *     summary: Guardar un tipo de enfermedad
 *     tags: [TipoEnfermedad]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoEnfermedad'
 *     responses:
 *       201:
 *         description: Tipo de enfermedad creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 * /tipo-enfermedad/editar/{id}:
 *   put:
 *     summary: Editar un tipo de enfermedad
 *     tags: [TipoEnfermedad]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de enfermedad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoEnfermedad'
 *     responses:
 *       200:
 *         description: Tipo de enfermedad actualizado exitosamente
 *       404:
 *         description: Tipo de enfermedad no encontrado
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 * /tipo-enfermedad/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un tipo de enfermedad
 *     tags: [TipoEnfermedad]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de enfermedad
 *     responses:
 *       200:
 *         description: Tipo de enfermedad eliminado exitosamente
 *       404:
 *         description: Tipo de enfermedad no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * /tipo-enfermedad/obtener/{id}:
 *   get:
 *     summary: Obtener tipo de enfermedad por ID
 *     tags: [TipoEnfermedad]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de enfermedad
 *     responses:
 *       200:
 *         description: Tipo de enfermedad encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoEnfermedad'
 *       404:
 *         description: Tipo de enfermedad no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/tipo-enfermedad/listar', tipoEnfermedadController.listarTipoEnfermedad);
router.post('/tipo-enfermedad/guardar', tipoEnfermedadController.guardarTipoEnfermedad);
router.put('/tipo-enfermedad/editar/:id', tipoEnfermedadController.editarTipoEnfermedad);
router.delete('/tipo-enfermedad/eliminar/:id', tipoEnfermedadController.eliminarTipoEnfermedad);
router.get('/tipo-enfermedad/obtener/:id', tipoEnfermedadController.obtenerTipoEnfermedadPorId);

module.exports = router;