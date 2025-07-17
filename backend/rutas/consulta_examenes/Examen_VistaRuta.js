const express = require('express');
const router = express.Router();
const examenVistaController = require('../../controladores/consulta_examenes/Examen_VistaController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * /examen-vista/listar:
 *   get:
 *     summary: Listar exámenes de vista (con filtros opcionales)
 *     tags: [Examen_Vista]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idConsulta
 *         schema:
 *           type: integer
 *         description: Filtrar por idConsulta
 *       - in: query
 *         name: idReceta
 *         schema:
 *           type: integer
 *         description: Filtrar por idReceta
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de exámenes de vista obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Examen_Vista'
 *             example:
 *               - id: 1
 *                 idConsulta: 10
 *                 idReceta: 5
 *                 resultado: "Visión 20/20"
 *                 fecha: "2025-07-17"
 *               - id: 2
 *                 idConsulta: 11
 *                 idReceta: 6
 *                 resultado: "Astigmatismo detectado"
 *                 fecha: "2025-07-18"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * /examen-vista/guardar:
 *   post:
 *     summary: Guardar un examen de vista
 *     tags: [Examen_Vista]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Examen_Vista'
 *           example:
 *             idConsulta: 10
 *             idReceta: 5
 *             resultado: "Visión 20/20"
 *             fecha: "2025-07-17"
 *     responses:
 *       201:
 *         description: Examen de vista creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Examen de vista creado
 *                 examenVista:
 *                   $ref: '#/components/schemas/Examen_Vista'
 *             example:
 *               mensaje: Examen de vista creado
 *               examenVista:
 *                 id: 1
 *                 idConsulta: 10
 *                 idReceta: 5
 *                 resultado: "Visión 20/20"
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
 * /examen-vista/editar/{id}:
 *   put:
 *     summary: Editar un examen de vista
 *     tags: [Examen_Vista]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del examen de vista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Examen_Vista'
 *           example:
 *             idConsulta: 10
 *             idReceta: 5
 *             resultado: "Visión 20/25"
 *             fecha: "2025-07-18"
 *     responses:
 *       200:
 *         description: Examen de vista actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Examen de vista actualizado
 *                 examenVista:
 *                   $ref: '#/components/schemas/Examen_Vista'
 *             example:
 *               mensaje: Examen de vista actualizado
 *               examenVista:
 *                 id: 1
 *                 idConsulta: 10
 *                 idReceta: 5
 *                 resultado: "Visión 20/25"
 *                 fecha: "2025-07-18"
 *       404:
 *         description: Examen de vista no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Examen de vista no encontrado
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
 * /examen-vista/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un examen de vista
 *     tags: [Examen_Vista]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del examen de vista
 *     responses:
 *       200:
 *         description: Examen de vista eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Examen de vista eliminado
 *             example:
 *               mensaje: Examen de vista eliminado
 *       404:
 *         description: Examen de vista no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Examen de vista no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * /examen-vista/obtener/{id}:
 *   get:
 *     summary: Obtener examen de vista por ID
 *     tags: [Examen_Vista]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del examen de vista
 *     responses:
 *       200:
 *         description: Examen de vista encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Examen_Vista'
 *             example:
 *               id: 1
 *               idConsulta: 10
 *               idReceta: 5
 *               resultado: "Visión 20/20"
 *               fecha: "2025-07-17"
 *       404:
 *         description: Examen de vista no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Examen de vista no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *
 * components:
 *   schemas:
 *     Examen_Vista:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         idConsulta:
 *           type: integer
 *           example: 10
 *         idReceta:
 *           type: integer
 *           example: 5
 *         resultado:
 *           type: string
 *           example: Visión 20/20
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2025-07-17"
 */

router.get('/examen-vista/listar', verificarUsuario, examenVistaController.listarExamenVista);
router.post('/examen-vista/guardar', verificarUsuario, examenVistaController.guardarExamenVista);
router.put('/examen-vista/editar/:id', verificarUsuario, examenVistaController.editarExamenVista);
router.delete('/examen-vista/eliminar/:id', verificarUsuario, examenVistaController.eliminarExamenVista);
router.get('/examen-vista/obtener/:id', verificarUsuario, examenVistaController.obtenerExamenVistaPorId);

module.exports = router;