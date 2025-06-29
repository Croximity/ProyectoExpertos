const { DataTypes } = require('sequelize');
const sequelize = require('../configuraciones/db');

const Usuario = sequelize.define('Usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nombre_Usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idPersona: {
    type: DataTypes.INTEGER,
    allowNull: true  // Lo dejaremos sin relación por ahora
  }
}, {
  tableName: 'usuario',
  timestamps: false,
});

module.exports = Usuario;
