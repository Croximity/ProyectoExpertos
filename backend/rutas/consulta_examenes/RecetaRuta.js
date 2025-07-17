const express = require('express');
const router = express.Router();
const recetaController = require('../../controladores/consulta_examenes/RecetaController');


/**  
 * @swagger  
 * /receta:  
 *   post:  
 *     summary: Crear una nueva receta  
 *     tags: [Receta]  
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
 *               Agudeza_Visual:  
 *                 type: string  
 *                 maxLength: 10  
 *                 example: "20/20"  
 *               EsferaIzquierdo:  
 *                 type: number  
 *                 format: float  
 *                 example: -2.5  
 *               Esfera_Derecho:  
 *                 type: number  
 *                 format: float  
 *                 example: -1.75  
 *               Cilindro_Izquierdo:  
 *                 type: number  
 *                 format: float  
 *                 example: -0.5  
 *               Cilindro_Derecho:  
 *                 type: number  
 *                 format: float  
 *                 example: -0.25  
 *               Eje_Izquierdo:  
 *                 type: number  
 *                 format: float  
 *                 example: 90  
 *               Eje_Derecho:  
 *                 type: number  
 *                 format: float  
 *                 example: 180  
 *               Distancia_Pupilar:  
 *                 type: number  
 *                 format: float  
 *                 example: 62.5  
 *               Tipo_Lente:  
 *                 type: string  
 *                 maxLength: 100  
 *                 example: "Progresivo"  
 *               Diagnostico:  
 *                 type: string  
 *                 example: "Miopía bilateral"  
 *               idCliente:  
 *                 type: integer  
 *                 example: 1  
 *               idEmpleado:  
 *                 type: integer  
 *                 example: 1  
 *               Fecha:  
 *                 type: string  
 *                 format: date  
 *                 example: "2025-07-17"  
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
 *                   example: "Receta creada"  
 *                 receta:  
 *                   type: object  
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
 *       500:  
 *         description: Error interno del servidor  
 */  
router.post('/receta', recetaController.crearReceta);
router.get('/receta', recetaController.obtenerRecetas);
router.get('/receta/:id', recetaController.obtenerRecetaPorId);
router.put('/receta/:id', recetaController.editarReceta);
router.delete('/receta/:id', recetaController.eliminarReceta);

module.exports = router; 