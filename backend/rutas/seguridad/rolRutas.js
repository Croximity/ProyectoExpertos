const express = require('express');
const router = express.Router();
const rolController = require('../../controladores/seguridad/rolController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles de usuario
 */

/**
 * @swagger
 * /rol:
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolInput'
 *     responses:
 *       201:
 *         description: Rol creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/rol', verificarUsuario, rolController.crearRol);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/roles', verificarUsuario, rolController.obtenerRoles);

/**
 * @swagger
 * /rol/{id}:
 *   put:
 *     summary: Editar un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolInput'
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/rol/:id', verificarUsuario, rolController.editarRol);

/**
 * @swagger
 * /rol/{id}:
 *   delete:
 *     summary: Eliminar un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *     responses:
 *       200:
 *         description: Rol eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Rol eliminado
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/rol/:id', verificarUsuario, rolController.eliminarRol);

/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       properties:
 *         idrol:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Administrador
 *         descripcion:
 *           type: string
 *           example: Tiene acceso completo al sistema
 *     RolInput:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           example: Administrador
 *         descripcion:
 *           type: string
 *           example: Tiene acceso completo al sistema
 */

module.exports = router;
