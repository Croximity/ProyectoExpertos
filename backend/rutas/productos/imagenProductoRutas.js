const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const imagenProductoController = require('../../controladores/productos/imagenProductoController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * /productos/imagen:
 *   put:
 *     summary: Actualizar imagen de producto
 *     security:
 *      - BearerAuth: []
 *     tags:
 *       - ImagenProducto
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - imagen
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen a subir
 *     responses:
 *       200:
 *         description: Imagen actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Imagen actualizada
 *       400:
 *         description: Error en la subida o parámetro id inválido
 */


router.put(
  '/imagen',
  query('id').isInt().withMessage('El id debe ser un número entero'),verificarUsuario,
  imagenProductoController.validarImagenProducto,
  imagenProductoController.actualizarImagenProducto
);

module.exports = router;
