const express = require('express');
const router = express.Router();
const examenVistaController = require('../../controladores/consulta_examenes/Examen_VistaController');

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
 *     responses:
 *       201:
 *         description: Examen de vista creado exitosamente
 *       400:
 *         description: Error de validación
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
 *     responses:
 *       200:
 *         description: Examen de vista actualizado exitosamente
 *       404:
 *         description: Examen de vista no encontrado
 *       400:
 *         description: Error de validación
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
 *       404:
 *         description: Examen de vista no encontrado
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
 *       404:
 *         description: Examen de vista no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/examen-vista/listar', examenVistaController.listarExamenVista);
router.post('/examen-vista/guardar', examenVistaController.guardarExamenVista);
router.put('/examen-vista/editar/:id', examenVistaController.editarExamenVista);
router.delete('/examen-vista/eliminar/:id', examenVistaController.eliminarExamenVista);
router.get('/examen-vista/obtener/:id', examenVistaController.obtenerExamenVistaPorId);

module.exports = router;