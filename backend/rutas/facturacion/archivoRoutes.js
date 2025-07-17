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