const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const categoriaController = require('../../controladores/productos/CategoriaProductoController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Gestión de categorías de productos
 */

/**
 * @swagger
 * /categorias/categoria:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *             example:
 *               - idCategoriaProducto: 1
 *                 Nombre: Lentes de Sol
 *                 descripcion: Categoría para lentes de sol
 *                 marca: Rayban
 *               - idCategoriaProducto: 2
 *                 Nombre: Lentes de Lectura
 *                 descripcion: Categoría para lentes de lectura
 *                 marca: Vogue
 */

/**
 * @swagger
 * /categorias/categoria/buscar:
 *   get:
 *     summary: Buscar categorías por filtros (Nombre, marca, descripción)
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: Nombre
 *         schema:
 *           type: string
 *         description: Filtro por Nombre (mínimo 3 caracteres)
 *         example: Lentes
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *         description: Filtro por marca (mínimo 3 caracteres)
 *         example: Rayban
 *       - in: query
 *         name: descripcion
 *         schema:
 *           type: string
 *         description: Filtro por descripción (mínimo 3 caracteres)
 *         example: ópticos
 *     responses:
 *       200:
 *         description: Lista de categorías filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: No se proveyeron filtros válidos
 */

/**
 * @swagger
 * /categorias/categoria:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaInput'
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Categoría creada
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
 */

/**
 * @swagger
 * /categorias/categoria/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 */

/**
 * @swagger
 * /categorias/categoria/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaInput'
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Categoría actualizada
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 */

/**
 * @swagger
 * /categorias/categoria/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         idCategoriaProducto:
 *           type: integer
 *           example: 1
 *         Nombre:
 *           type: string
 *           example: Lentes de Sol
 *         descripcion:
 *           type: string
 *           example: Categoría para lentes de sol
 *         marca:
 *           type: string
 *           example: Rayban
 *     CategoriaInput:
 *       type: object
 *       required:
 *         - Nombre
 *       properties:
 *         Nombre:
 *           type: string
 *           example: Lentes de Sol
 *         descripcion:
 *           type: string
 *           example: Categoría para lentes de sol
 *         marca:
 *           type: string
 *           example: Rayban
 */

// Obtener todas las categorías (sin filtros)
router.get('/categoria', verificarUsuario, categoriaController.obtenerCategorias);

// Buscar categorías con filtros (nombre, marca, descripción)
router.get(
  '/categoria/buscar',
  [
    query('nombre').optional().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    query('marca').optional().isLength({ min: 3 }).withMessage('La marca debe tener al menos 3 caracteres'),
    query('descripcion').optional().isLength({ min: 3 }).withMessage('La descripción debe tener al menos 3 caracteres'),
  ],
  verificarUsuario,
  categoriaController.buscarCategorias
);

// Crear categoría
router.post(
  '/categoria',
  body('nombre')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
  verificarUsuario,
  categoriaController.crearCategoria
);

// Obtener categoría por ID
router.get(
  '/categoria/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  verificarUsuario,
  categoriaController.obtenerCategoriaPorId
);

// Actualizar categoría
router.put(
  '/categoria/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('nombre')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
  verificarUsuario,
  categoriaController.actualizarCategoria
);

// Eliminar categoría
router.delete(
  '/categoria/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  verificarUsuario,
  categoriaController.eliminarCategoria
);

module.exports = router;
