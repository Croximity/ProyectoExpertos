const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
  idPersona: {
    type: Number,
    unique: true,
    sparse: true
  },
  Pnombre: {
    type: String,
    required: true,
    maxlength: 45
  },
  Snombre: {
    type: String,
    maxlength: 45
  },
  Papellido: {
    type: String,
    maxlength: 45
  },
  Sapellido: {
    type: String,
    maxlength: 45
  },
  Direccion: {
    type: String,
    maxlength: 200
  },
  DNI: {
    type: String,
    maxlength: 45
  },
  correo: {
    type: String,
    maxlength: 100
  },
  fechaNacimiento: {
    type: Date
  },
  genero: {
    type: String,
    required: true,
    default: 'M',
    maxlength: 1
  }
}, {
  timestamps: true,
  collection: 'personas'
});

// Middleware para auto-generar idPersona si no existe
personaSchema.pre('save', async function(next) {
  if (!this.idPersona) {
    const lastPerson = await this.constructor.findOne({}, {}, { sort: { 'idPersona': -1 } });
    this.idPersona = lastPerson ? lastPerson.idPersona + 1 : 1;
  }
  next();
});

// Índices para mejorar el rendimiento
personaSchema.index({ idPersona: 1 });
personaSchema.index({ DNI: 1 });
personaSchema.index({ correo: 1 });

module.exports = mongoose.model('Persona', personaSchema);
