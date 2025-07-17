const express = require('express');
const router = express.Router();
const rolController = require('../../controladores/seguridad/rolController');
/**
 * @swagger
 * tags:
 *   name: Rol
 *   description: Endpoints para gestionar roles de usuario
 */

/**
 * @swagger
 * /roles/rol:
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Rol]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Administrador
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /roles/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Rol]
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
 *         description: Error del servidor
 */

/**
 * @swagger
 * /roles/rol/{id}:
 *   put:
 *     summary: Editar un rol por ID
 *     tags: [Rol]
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
 *             $ref: '#/components/schemas/Rol'
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /roles/rol/{id}:
 *   delete:
 *     summary: Eliminar un rol por ID
 *     tags: [Rol]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *     responses:
 *       200:
 *         description: Rol eliminado
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Supervisor
 */

// Crear un rol
router.post('/rol', rolController.crearRol);

// Obtener todos los roles
router.get('/roles', rolController.obtenerRoles);

// Editar un rol
router.put('/rol/:id', rolController.editarRol);

// Eliminar un rol
router.delete('/rol/:id', rolController.eliminarRol);

module.exports = router;
