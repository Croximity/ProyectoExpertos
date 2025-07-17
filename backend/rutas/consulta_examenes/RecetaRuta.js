const express = require('express');
const router = express.Router();
const recetaController = require('../../controladores/consulta_examenes/RecetaController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * /receta/guardar:
 *   post:
 *     summary: Crear una nueva receta
 *     tags: [Recetas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idCliente
 *               - idEmpleado
 *             properties:
 *               idCliente:
 *                 type: integer
 *                 description: ID del cliente asociado a la receta
 *                 example: 1
 *               idEmpleado:
 *                 type: integer
 *                 description: ID del empleado asociado a la receta
 *                 example: 1
 *               Agudeza_Visual:
 *                 type: string
 *                 description: Agudeza visual (máximo 10 caracteres, opcional)
 *                 example: "20/20"
 *               EsferaIzquierdo:
 *                 type: number
 *                 format: float
 *                 description: Esfera del ojo izquierdo (opcional)
 *                 example: -1.25
 *               Esfera_Derecho:
 *                 type: number
 *                 format: float
 *                 description: Esfera del ojo derecho (opcional)
 *                 example: -1.50
 *               Cilindro_Izquierdo:
 *                 type: number
 *                 format: float
 *                 description: Cilindro del ojo izquierdo (opcional)
 *                 example: -0.75
 *               Cilindro_Derecho:
 *                 type: number
 *                 format: float
 *                 description: Cilindro del ojo derecho (opcional)
 *                 example: -0.50
 *               Eje_Izquierdo:
 *                 type: number
 *                 format: float
 *                 description: Eje del ojo izquierdo (opcional)
 *                 example: 90
 *               Eje_Derecho:
 *                 type: number
 *                 format: float
 *                 description: Eje del ojo derecho (opcional)
 *                 example: 85
 *               Distancia_Pupilar:
 *                 type: number
 *                 format: float
 *                 description: Distancia pupilar (opcional)
 *                 example: 62
 *               Tipo_Lente:
 *                 type: string
 *                 description: Tipo de lente (máximo 100 caracteres, opcional)
 *                 example: "Monofocal"
 *               Diagnostico:
 *                 type: string
 *                 description: Diagnóstico (opcional)
 *                 example: "Miopía leve"
 *               Fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la receta (opcional)
 *                 example: "2025-07-16"
 *     responses:
 *       201:
 *         description: Receta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Receta creada
 *                 receta:
 *                   $ref: '#/components/schemas/Receta'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El idCliente debe ser un número entero
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Token no proporcionado o inválido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al crear receta
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */
router.post('/receta/guardar', verificarUsuario, recetaController.guardarReceta);

/**
 * @swagger
 * /receta/listar:
 *   get:
 *     summary: Obtener todas las recetas con filtros opcionales
 *     tags: [Recetas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idCliente
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID del cliente para filtrar
 *         example: 1
 *       - in: query
 *         name: idEmpleado
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID del empleado para filtrar
 *         example: 1
 *       - in: query
 *         name: tipoLente
 *         schema:
 *           type: string
 *         required: false
 *         description: Tipo de lente para filtrar
 *         example: "Monofocal"
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha inicial para filtrar
 *         example: "2025-07-01"
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha final para filtrar
 *         example: "2025-07-31"
 *     responses:
 *       200:
 *         description: Lista de recetas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receta'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: idCliente debe ser un número entero
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Token no proporcionado o inválido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al obtener recetas
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */
router.get('/receta/listar', verificarUsuario, recetaController.listarReceta);

/**
 * @swagger
 * /receta/obtener/{id}:
 *   get:
 *     summary: Obtener una receta por ID
 *     tags: [Recetas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la receta
 *         example: 1
 *     responses:
 *       200:
 *         description: Receta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receta'
 *       404:
 *         description: Receta no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Receta no encontrada
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Token no proporcionado o inválido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al obtener receta
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */
router.get('/receta/obtener/:id', verificarUsuario, recetaController.obtenerRecetaPorId);

/**
 * @swagger
 * /receta/editar/{id}:
 *   put:
 *     summary: Actualizar una receta existente
 *     tags: [Recetas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la receta
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idCliente:
 *                 type: integer
 *                 description: ID del cliente asociado a la receta (opcional)
 *                 example: 1
 *               idEmpleado:
 *                 type: integer
 *                 description: ID del empleado asociado a la receta (opcional)
 *                 example: 1
 *               Agudeza_Visual:
 *                 type: string
 *                 description: Agudeza visual (máximo 10 caracteres, opcional)
 *                 example: "20/20"
 *               EsferaIzquierdo:
 *                 type: number
 *                 format: float
 *                 description: Esfera del ojo izquierdo (opcional)
 *                 example: -1.25
 *               Esfera_Derecho:
 *                 type: number
 *                 format: float
 *                 description: Esfera del ojo derecho (opcional)
 *                 example: -1.50
 *               Cilindro_Izquierdo:
 *                 type: number
 *                 format: float
 *                 description: Cilindro del ojo izquierdo (opcional)
 *                 example: -0.75
 *               Cilindro_Derecho:
 *                 type: number
 *                 format: float
 *                 description: Cilindro del ojo derecho (opcional)
 *                 example: -0.50
 *               Eje_Izquierdo:
 *                 type: number
 *                 format: float
 *                 description: Eje del ojo izquierdo (opcional)
 *                 example: 90
 *               Eje_Derecho:
 *                 type: number
 *                 format: float
 *                 description: Eje del ojo derecho (opcional)
 *                 example: 85
 *               Distancia_Pupilar:
 *                 type: number
 *                 format: float
 *                 description: Distancia pupilar (opcional)
 *                 example: 62
 *               Tipo_Lente:
 *                 type: string
 *                 description: Tipo de lente (máximo 100 caracteres, opcional)
 *                 example: "Monofocal"
 *               Diagnostico:
 *                 type: string
 *                 description: Diagnóstico (opcional)
 *                 example: "Miopía leve"
 *               Fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la receta (opcional)
 *                 example: "2025-07-16"
 *     responses:
 *       200:
 *         description: Receta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Receta actualizada
 *                 receta:
 *                   $ref: '#/components/schemas/Receta'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El idCliente debe ser un número entero
 *       404:
 *         description: Receta no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Receta no encontrada
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Token no proporcionado o inválido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al editar receta
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */
router.put('/receta/editar/:id', verificarUsuario, recetaController.editarReceta);

/**
 * @swagger
 * /receta/eliminar/{id}:
 *   delete:
 *     summary: Eliminar una receta
 *     tags: [Recetas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la receta
 *         example: 1
 *     responses:
 *       200:
 *         description: Receta eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Receta eliminada
 *       404:
 *         description: Receta no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Receta no encontrada
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Token no proporcionado o inválido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al eliminar receta
 *                 error:
 *                   type: string
 *                   example: Mensaje de error
 */
router.delete('/receta/eliminar/:id', verificarUsuario, recetaController.eliminarReceta);

/**
 * @swagger
 * components:
 *   schemas:
 *     Receta:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la receta
 *           example: 1
 *         idCliente:
 *           type: integer
 *           description: ID del cliente asociado
 *           example: 1
 *         idEmpleado:
 *           type: integer
 *           description: ID del empleado asociado
 *           example: 1
 *         Agudeza_Visual:
 *           type: string
 *           description: Agudeza visual
 *           example: "20/20"
 *         EsferaIzquierdo:
 *           type: number
 *           format: float
 *           description: Esfera del ojo izquierdo
 *           example: -1.25
 *         Esfera_Derecho:
 *           type: number
 *           format: float
 *           description: Esfera del ojo derecho
 *           example: -1.50
 *         Cilindro_Izquierdo:
 *           type: number
 *           format: float
 *           description: Cilindro del ojo izquierdo
 *           example: -0.75
 *         Cilindro_Derecho:
 *           type: number
 *           format: float
 *           description: Cilindro del ojo derecho
 *           example: -0.50
 *         Eje_Izquierdo:
 *           type: number
 *           format: float
 *           description: Eje del ojo izquierdo
 *           example: 90
 *         Eje_Derecho:
 *           type: number
 *           format: float
 *           description: Eje del ojo derecho
 *           example: 85
 *         Distancia_Pupilar:
 *           type: number
 *           format: float
 *           description: Distancia pupilar
 *           example: 62
 *         Tipo_Lente:
 *           type: string
 *           description: Tipo de lente
 *           example: "Monofocal"
 *         Diagnostico:
 *           type: string
 *           description: Diagnóstico
 *           example: "Miopía leve"
 *         Fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la receta
 *           example: "2025-07-16"
 */

module.exports = router;