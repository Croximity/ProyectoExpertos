const express = require('express');  
const multer = require('multer');  
const path = require('path');  
const fs = require('fs');  
const router = express.Router();  
  
/**  
 * @swagger  
 * tags:  
 *   name: Archivos  
 *   description: Gestión de subida y descarga de archivos  
 */  
  
// Crear carpeta uploads si no existe  
const uploadDir = path.join(__dirname, '../../uploads');  
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });  
  
// Configuración de almacenamientos  
const storage = multer.diskStorage({  
  destination: (req, file, cb) => cb(null, uploadDir),  
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)  
});  
  
// Validaciones de tipo y tamaño  
const fileFilter = (req, file, cb) => {  
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];  
  if (!allowedTypes.includes(file.mimetype)) {  
    return cb(new Error('Tipo de archivo no permitido'), false);  
  }  
  cb(null, true);  
};  
  
const upload = multer({  
  storage,  
  fileFilter,  
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB  
  onError: (err, next) => {  
    console.error('Error en multer:', err);  
    next(err);  
  }  
});  
  
/**  
 * @swagger  
 * /upload:  
 *   post:  
 *     summary: Subir un archivo  
 *     tags: [Archivos]  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         multipart/form-data:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               archivo:  
 *                 type: string  
 *                 format: binary  
 *                 description: Archivo a subir (PDF, JPEG, PNG)  
 *     responses:  
 *       200:  
 *         description: Archivo subido correctamente  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 mensaje:  
 *                   type: string  
 *                   example: "Archivo subido correctamente"  
 *                 archivo:  
 *                   type: string  
 *                   example: "1640995200000-documento.pdf"  
 *       400:  
 *         description: Archivo no válido o tipo no permitido  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   example: "Archivo no válido"  
 *       413:  
 *         description: Archivo demasiado grande (máximo 5MB)  
 */  
router.post('/upload', (req, res) => {  
  upload.single('archivo')(req, res, (err) => {  
    if (err) {  
      if (err.code === 'LIMIT_FILE_SIZE') {  
        return res.status(413).json({ error: 'Archivo demasiado grande. Máximo 5MB' });  
      }  
      return res.status(400).json({ error: err.message });  
    }  
      
    if (!req.file) {  
      return res.status(400).json({ error: 'Archivo no válido' });  
    }  
      
    res.json({   
      mensaje: 'Archivo subido correctamente',   
      archivo: req.file.filename,  
      tamaño: req.file.size,  
      tipo: req.file.mimetype  
    });  
  });  
});  
  
/**  
 * @swagger  
 * /download/{filename}:  
 *   get:  
 *     summary: Descargar un archivo  
 *     tags: [Archivos]  
 *     parameters:  
 *       - in: path  
 *         name: filename  
 *         required: true  
 *         schema:  
 *           type: string  
 *         description: Nombre del archivo a descargar  
 *         example: "1640995200000-documento.pdf"  
 *     responses:  
 *       200:  
 *         description: Archivo descargado correctamente  
 *         content:  
 *           application/octet-stream:  
 *             schema:  
 *               type: string  
 *               format: binary  
 *       404:  
 *         description: Archivo no encontrado  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   example: "Archivo no encontrado"  
 */  
router.get('/download/:filename', (req, res) => {  
  const filename = req.params.filename;  
    
  // Validación básica del nombre de archivo  
  if (!filename || filename.includes('..') || filename.includes('/')) {  
    return res.status(400).json({ error: 'Nombre de archivo inválido' });  
  }  
    
  const filePath = path.join(uploadDir, filename);  
    
  if (!fs.existsSync(filePath)) {  
    return res.status(404).json({ error: 'Archivo no encontrado' });  
  }  
    
  res.download(filePath, (err) => {  
    if (err) {  
      console.error('Error al descargar archivo:', err);  
      res.status(500).json({ error: 'Error al descargar archivo' });  
    }  
  });  
});  
  
module.exports = router;