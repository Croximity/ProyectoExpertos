const multer = require('multer');
const path = require('path');
const fs = require('fs');

function ensureDirSync(dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (_) {
    // ignore
  }
}

function isImageMimetype(mimetype) {
  return typeof mimetype === 'string' && mimetype.toLowerCase().startsWith('image/');
}

function buildFilename(prefix, id, originalname) {
  const aleatorio = Math.floor(Math.random() * (99998 - 10001)) + 10001;
  const ext = path.extname(originalname) || '';
  return `${prefix}-${aleatorio}-${id}${ext}`;
}

const almacenarUsuarios = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '../../public/img/usuarios');
    ensureDirSync(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    if (isImageMimetype(file.mimetype)) {
      cb(null, buildFilename('usuario', req.query.id, file.originalname));
    } else {
      cb(new Error('Tipo de archivo no permitido'), '');
    }
  }
});

const almacenarProductos = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '../../public/img/productos');
    ensureDirSync(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    if (isImageMimetype(file.mimetype)) {
      cb(null, buildFilename('producto', req.query.id, file.originalname));
    } else {
      cb(new Error('Tipo de archivo no permitido'), '');
    }
  }
});

exports.uploadImagenUsuario = multer({
  storage: almacenarUsuarios,
  fileFilter: (req, file, cb) => {
    if (isImageMimetype(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo se permiten archivos de imagen"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('imagen');

exports.uploadImagenProducto = multer({
  storage: almacenarProductos,
  fileFilter: (req, file, cb) => {
    if (isImageMimetype(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo se permiten archivos de imagen"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('imagen');

