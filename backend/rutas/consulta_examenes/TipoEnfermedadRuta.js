const express = require('express');
const router = express.Router();
const tipoEnfermedadController = require('../../controladores/consulta_examenes/TipoEnfermedadController');
const { verificarUsuario } = require('../../configuraciones/passport');

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
 *             example:
 *               - id: 1
 *                 nombre: "Miopía"
 *                 descripcion: "Dificultad para ver objetos lejanos"
 *               - id: 2
 *                 nombre: "Astigmatismo"
 *                 descripcion: "Visión borrosa por curvatura irregular"
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
 *           example:
 *             Nombre: "Miopía"
 *             Descripcion: "Dificultad para ver objetos lejanos"
 *     responses:
 *       201:
 *         description: Tipo de enfermedad creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Tipo de enfermedad creado
 *                 tipoEnfermedad:
 *                   $ref: '#/components/schemas/TipoEnfermedad'
 *             example:
 *               mensaje: Tipo de enfermedad creado
 *               tipoEnfermedad:
 *                 id: 1
 *                 nombre: "Miopía"
 *                 descripcion: "Dificultad para ver objetos lejanos"
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
 *           example:
 *             nombre: "Astigmatismo"
 *             descripcion: "Visión borrosa por curvatura irregular"
 *     responses:
 *       200:
 *         description: Tipo de enfermedad actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Tipo de enfermedad actualizado
 *                 tipoEnfermedad:
 *                   $ref: '#/components/schemas/TipoEnfermedad'
 *             example:
 *               mensaje: Tipo de enfermedad actualizado
 *               tipoEnfermedad:
 *                 id: 2
 *                 nombre: "Astigmatismo"
 *                 descripcion: "Visión borrosa por curvatura irregular"
 *       404:
 *         description: Tipo de enfermedad no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Tipo de enfermedad no encontrado
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Tipo de enfermedad eliminado
 *             example:
 *               mensaje: Tipo de enfermedad eliminado
 *       404:
 *         description: Tipo de enfermedad no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Tipo de enfermedad no encontrado
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
 *             example:
 *               id: 1
 *               nombre: "Miopía"
 *               descripcion: "Dificultad para ver objetos lejanos"
 *       404:
 *         description: Tipo de enfermedad no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Tipo de enfermedad no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *
 * components:
 *   schemas:
 *     TipoEnfermedad:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Miopía
 *         descripcion:
 *           type: string
 *           example: Dificultad para ver objetos lejanos
 */

router.get('/tipo-enfermedad/listar', verificarUsuario, tipoEnfermedadController.listarTipoEnfermedad);
router.post('/tipo-enfermedad/guardar', verificarUsuario, tipoEnfermedadController.guardarTipoEnfermedad);
router.put('/tipo-enfermedad/editar/:id', verificarUsuario, tipoEnfermedadController.editarTipoEnfermedad);
router.delete('/tipo-enfermedad/eliminar/:id', verificarUsuario, tipoEnfermedadController.eliminarTipoEnfermedad);
router.get('/tipo-enfermedad/obtener/:id', verificarUsuario, tipoEnfermedadController.obtenerTipoEnfermedadPorId);

module.exports = router;