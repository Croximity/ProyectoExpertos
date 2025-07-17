const express = require('express');
const router = express.Router();
const recetaController = require('../../controladores/consulta_examenes/RecetaController');
const { verificarUsuario } = require('../../configuraciones/passport');
/**
 * @swagger
 * /receta/listar:
 *   get:
 *     summary: Listar recetas (con filtros opcionales)
 *     tags: [Receta]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idCliente
 *         schema:
 *           type: integer
 *         description: Filtrar por idCliente
 *       - in: query
 *         name: idEmpleado
 *         schema:
 *           type: integer
 *         description: Filtrar por idEmpleado
 *       - in: query
 *         name: tipoLente
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de lente
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
 *         description: Lista de recetas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receta'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * /receta/guardar:
 *   post:
 *     summary: Guardar una receta
 *     tags: [Receta]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Receta'
 *     responses:
 *       201:
 *         description: Receta creada exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 * /receta/editar/{id}:
 *   put:
 *     summary: Editar una receta
 *     tags: [Receta]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la receta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Receta'
 *     responses:
 *       200:
 *         description: Receta actualizada exitosamente
 *       404:
 *         description: Receta no encontrada
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 * /receta/eliminar/{id}:
 *   delete:
 *     summary: Eliminar una receta
 *     tags: [Receta]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la receta
 *     responses:
 *       200:
 *         description: Receta eliminada exitosamente
 *       404:
 *         description: Receta no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * /receta/obtener/{id}:
 *   get:
 *     summary: Obtener receta por ID
 *     tags: [Receta]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la receta
 *     responses:
 *       200:
 *         description: Receta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receta'
 *       404:
 *         description: Receta no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/receta/listar', verificarUsuario, recetaController.listarReceta);
router.post('/receta/guardar', verificarUsuario, recetaController.guardarReceta);
router.put('/receta/editar/:id', verificarUsuario, recetaController.editarReceta);
router.delete('/receta/eliminar/:id', verificarUsuario, recetaController.eliminarReceta);
router.get('/receta/obtener/:id', verificarUsuario, recetaController.obtenerRecetaPorId);

module.exports = router;