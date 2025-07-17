const express = require('express');
const router = express.Router();
const personaController = require('../../controladores/seguridad/personaController');
const {verificarUsuario} = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: Personas
 *   description: Gestión de personas
 */

/**
 * @swagger
 * /persona:
 *   post:
 *     summary: Crear una persona
 *     tags: [Personas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonaInput'
 *     responses:
 *       201:
 *         description: Persona creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Persona'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/persona', verificarUsuario, personaController.crearPersona);

/**
 * @swagger
 * /persona/{id}:
 *   put:
 *     summary: Editar una persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la persona a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonaInput'
 *     responses:
 *       200:
 *         description: Persona actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Persona'
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/persona/:id', verificarUsuario, personaController.editarPersona);

/**
 * @swagger
 * /persona/{id}:
 *   delete:
 *     summary: Eliminar una persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la persona a eliminar
 *     responses:
 *       200:
 *         description: Persona eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Persona eliminada
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/persona/:id', verificarUsuario, personaController.eliminarPersona);

/**
 * @swagger
 * /personas:
 *   post:
 *     summary: Crear múltiples personas
 *     tags: [Personas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/PersonaInput'
 *     responses:
 *       201:
 *         description: Personas creadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Personas creadas
 *                 personas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Persona'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/personas', verificarUsuario, personaController.crearMultiplesPersonas);

/**
 * @swagger
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       properties:
 *         idPersona:
 *           type: integer
 *           example: 1
 *         Pnombre:
 *           type: string
 *           example: Juan
 *         Snombre:
 *           type: string
 *           example: Carlos
 *         Papellido:
 *           type: string
 *           example: Hernández
 *         Sapellido:
 *           type: string
 *           example: Ramírez
 *         Direccion:
 *           type: string
 *           example: Col. Kennedy
 *         DNI:
 *           type: string
 *           example: 0801199012345
 *         correo:
 *           type: string
 *           example: juan.carlos@example.com
 *         fechaNacimiento:
 *           type: string
 *           format: date
 *           example: 1990-05-15
 *         genero:
 *           type: string
 *           example: M
 *     PersonaInput:
 *       type: object
 *       required:
 *         - Pnombre
 *         - genero
 *       properties:
 *         Pnombre:
 *           type: string
 *           example: Juan
 *         Snombre:
 *           type: string
 *           example: Carlos
 *         Papellido:
 *           type: string
 *           example: Hernández
 *         Sapellido:
 *           type: string
 *           example: Ramírez
 *         Direccion:
 *           type: string
 *           example: Col. Kennedy
 *         DNI:
 *           type: string
 *           example: 0801199012345
 *         correo:
 *           type: string
 *           example: juan.carlos@example.com
 *         fechaNacimiento:
 *           type: string
 *           format: date
 *           example: 1990-05-15
 *         genero:
 *           type: string
 *           example: M
 */

module.exports = router;
