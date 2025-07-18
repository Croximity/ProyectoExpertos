const express = require('express');
const router = express.Router();
const diagnosticoController = require('../../controladores/consulta_examenes/DiagnosticoController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: Diagnostico
 *   description: Gestión de diagnósticos médicos
 */

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
 *             example:
 *               - id: 1
 *                 idConsulta: 10
 *                 descripcion: "Miopía leve detectada"
 *                 fecha: "2025-07-17"
 *               - id: 2
 *                 idConsulta: 11
 *                 descripcion: "Astigmatismo moderado"
 *                 fecha: "2025-07-18"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
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
 *             $ref: '#/components/schemas/DiagnosticoInput'
 *           example:
 *             idConsulta: 10
 *             idTipoEnfermedad: 1
 *             idExamen: 1
 *             descripcion: "Miopía leve detectada"
 *             fecha: "2025-07-17"
 *     responses:
 *       201:
 *         description: Diagnóstico creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Diagnóstico creado
 *                 diagnostico:
 *                   $ref: '#/components/schemas/Diagnostico'
 *             example:
 *               mensaje: Diagnóstico creado
 *               diagnostico:
 *                 id: 1
 *                 idConsulta: 10
 *                 descripcion: "Miopía leve detectada"
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
 */

/**
 * @swagger
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
 *             $ref: '#/components/schemas/DiagnosticoInput'
 *           example:
 *             idConsulta: 10
 *             descripcion: "Miopía leve actualizada"
 *             fecha: "2025-07-18"
 *     responses:
 *       200:
 *         description: Diagnóstico actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Diagnóstico actualizado
 *                 diagnostico:
 *                   $ref: '#/components/schemas/Diagnostico'
 *             example:
 *               mensaje: Diagnóstico actualizado
 *               diagnostico:
 *                 id: 1
 *                 idConsulta: 10
 *                 descripcion: "Miopía leve actualizada"
 *                 fecha: "2025-07-18"
 *       404:
 *         description: Diagnóstico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Diagnóstico no encontrado
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
 */

/**
 * @swagger
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Diagnóstico eliminado
 *             example:
 *               mensaje: Diagnóstico eliminado
 *       404:
 *         description: Diagnóstico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Diagnóstico no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
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
 *             example:
 *               id: 1
 *               idConsulta: 10
 *               descripcion: "Miopía leve detectada"
 *               fecha: "2025-07-17"
 *       404:
 *         description: Diagnóstico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Diagnóstico no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Diagnostico:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         idConsulta:
 *           type: integer
 *           example: 10
 *         descripcion:
 *           type: string
 *           example: Miopía leve detectada
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2025-07-17"
 *     DiagnosticoInput:
 *       type: object
 *       required:
 *         - idConsulta
 *         - descripcion
 *         - fecha
 *       properties:
 *         idConsulta:
 *           type: integer
 *           example: 10
 *         descripcion:
 *           type: string
 *           example: Miopía leve detectada
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2025-07-17"
 */

router.get('/diagnostico/listar', verificarUsuario, diagnosticoController.listarDiagnostico);
router.post('/diagnostico/guardar', verificarUsuario, diagnosticoController.guardarDiagnostico);
router.put('/diagnostico/editar/:id', verificarUsuario, diagnosticoController.editarDiagnostico);
router.delete('/diagnostico/eliminar/:id', verificarUsuario, diagnosticoController.eliminarDiagnostico);
router.get('/diagnostico/obtener/:id', verificarUsuario, diagnosticoController.obtenerDiagnosticoPorId);

module.exports = router;