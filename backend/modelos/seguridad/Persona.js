const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db'); // Ajusta según tu estructura de proyecto

const Persona = db.define('Persona', {
  idPersona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Pnombre: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  Snombre: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Papellido: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Sapellido: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Direccion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  DNI: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fechaNacimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  genero: {
    type: DataTypes.STRING(1),
    allowNull: false,
    default: "M"

  }
}, {
  tableName: 'persona',
  timestamps: false
});

module.exports = Persona;
