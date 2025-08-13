const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  idUsuario: {
    type: Number,
    unique: true,
    sparse: true
  },
  Nombre_Usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contraseña: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['Activo', 'Bloqueado', 'Inactivo', 'Logeado'],
    default: 'Activo'
  },
  idPersona: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Persona'
  },
  idrol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rol'
  }
}, {
  timestamps: true,
  collection: 'usuarios'
});

// Middleware para auto-generar idUsuario si no existe
usuarioSchema.pre('save', async function(next) {
  if (!this.idUsuario) {
    const lastUser = await this.constructor.findOne({}, {}, { sort: { 'idUsuario': -1 } });
    this.idUsuario = lastUser ? lastUser.idUsuario + 1 : 1;
  }
  next();
});

// Índices para mejorar el rendimiento
usuarioSchema.index({ idUsuario: 1 });
usuarioSchema.index({ Nombre_Usuario: 1 });
usuarioSchema.index({ idPersona: 1 });
usuarioSchema.index({ idrol: 1 });

module.exports = mongoose.model('Usuario', usuarioSchema);
