const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const productoController = require('../../controladores/productos/productoController');
const Producto = require('../../modelos/productos/ProductoModel');
const CategoriaProducto = require('../../modelos/productos/CategoriaProducto');
const {verificarUsuario} = require('../../configuraciones/passport');
/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Operaciones relacionadas con productos
 */

/**
 * @swagger
 * /productos/producto/buscar:
 *   get:
 *     summary: Buscar productos por filtros
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filtro
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtro de búsqueda (puedes personalizar los parámetros)
 *         example: lente
 *     responses:
 *       200:
 *         description: Lista de productos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */

/**
 * @swagger
 * /productos/producto:
 *   post:
 *     summary: Crear un producto
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Producto creado
 *                 producto:
 *                   $ref: '#/components/schemas/Producto'
 */

/**
 * @swagger
 * /productos/producto:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */

/**
 * @swagger
 * /productos/producto/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /productos/producto/{id}:
 *   put:
 *     summary: Editar un producto
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto a editar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Producto actualizado
 *                 producto:
 *                   $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /productos/producto/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         idProducto:
 *           type: integer
 *           example: 1
 *         Nombre:
 *           type: string
 *           example: Lentes de Sol Polarizados
 *         idCategoriaProducto:
 *           type: integer
 *           example: 2
 *         impuesto:
 *           type: number
 *           example: 12.5
 *         marca:
 *           type: string
 *           example: Rayban
 *         precioCosto:
 *           type: number
 *           example: 100.50
 *         precioVenta:
 *           type: number
 *           example: 150.75
 *         stockInicial:
 *           type: integer
 *           example: 50
 *         imagen:
 *           type: string
 *           example: producto1.jpg
 *     ProductoInput:
 *       type: object
 *       required:
 *         - Nombre
 *         - idCategoriaProducto
 *         - precioCosto
 *         - precioVenta
 *       properties:
 *         Nombre:
 *           type: string
 *           example: Lentes de Sol Polarizados
 *         idCategoriaProducto:
 *           type: integer
 *           example: 2
 *         impuesto:
 *           type: number
 *           example: 12.5
 *         marca:
 *           type: string
 *           example: Rayban
 *         precioCosto:
 *           type: number
 *           example: 100.50
 *         precioVenta:
 *           type: number
 *           example: 150.75
 *         stockInicial:
 *           type: integer
 *           example: 50
 */


// Buscar productos por filtro
router.get('/producto/buscar', verificarUsuario, productoController.buscarProducto);

// Crear un producto
router.post('/producto',
  body('Nombre')
    .isLength({ min: 3, max: 100 })
    .withMessage('Nombre debe tener entre 3 y 100 caracteres'),
  body('idCategoriaProducto')
    .isInt().withMessage('idCategoriaProducto debe ser un número entero')
    .custom(async (value) => {
      const categoria = await CategoriaProducto.findByPk(value);
      if (!categoria) {
        throw new Error('La categoría no existe');
      }
    }),
  body('precioCosto')
    .isFloat({ min: 0 })
    .withMessage('El precio de costo debe ser un número positivo'),
  body('precioVenta')
    .isFloat({ min: 0 })
    .withMessage('El precio de venta debe ser un número positivo'),
  body('impuesto')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El impuesto debe ser un número'),
  body('marca')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Máximo 100 caracteres para marca'),
  body('stockInicial')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock inicial debe ser un número entero ≥ 0'),
  verificarUsuario,
  productoController.crearProducto
);

// Obtener todos los productos
router.get('/producto', verificarUsuario, productoController.obtenerProductos);

// Obtener un producto por ID
router.get('/producto/:id',
  param('id')
    .isInt().withMessage('El ID debe ser un número entero')
    .custom(async (value) => {
      const producto = await Producto.findByPk(value);
      if (!producto) throw new Error('El producto no existe');
    }),
  verificarUsuario,
  productoController.obtenerProductoPorId
);

// Editar un producto
router.put('/producto/:id',
  param('id')
    .isInt().withMessage('El ID debe ser un número entero')
    .custom(async (value) => {
      const producto = await Producto.findByPk(value);
      if (!producto) throw new Error('El producto no existe');
    }),
  body('Nombre')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nombre debe tener entre 3 y 100 caracteres'),
  body('precioCosto')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio de costo debe ser un número positivo'),
  body('precioVenta')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio de venta debe ser un número positivo'),
  body('impuesto')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El impuesto debe ser un número'),
  body('marca')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Máximo 100 caracteres para marca'),
  body('stockInicial')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock inicial debe ser un número entero ≥ 0'),
  verificarUsuario,
  productoController.editarProducto
);

// Eliminar un producto
router.delete('/producto/:id',
  param('id')
    .isInt().withMessage('El ID debe ser un número entero')
    .custom(async (value) => {
      const producto = await Producto.findByPk(value);
      if (!producto) throw new Error('El producto no existe');
    }),
  verificarUsuario,
  productoController.eliminarProducto
);

module.exports = router;
