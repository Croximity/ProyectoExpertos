const mongoose = require('mongoose');

const rolSchema = new mongoose.Schema({
  idRol: {
    type: Number,
    unique: true,
    sparse: true
  },
  nombre: {
    type: String,
    maxlength: 45
  },
  descripcion: {
    type: String,
    maxlength: 45
  }
}, {
  timestamps: true,
  collection: 'roles'
});

// Middleware para auto-generar idRol si no existe
rolSchema.pre('save', async function(next) {
  if (!this.idRol) {
    const lastRol = await this.constructor.findOne({}, {}, { sort: { 'idRol': -1 } });
    this.idRol = lastRol ? lastRol.idRol + 1 : 1;
  }
  next();
});

// Índices para mejorar el rendimiento
rolSchema.index({ idRol: 1 });
rolSchema.index({ nombre: 1 });

module.exports = mongoose.model('Rol', rolSchema);
