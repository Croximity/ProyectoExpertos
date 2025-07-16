const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');

const TipoEnfermedad = db.define('TipoEnfermedad', {
  idTipoEnfermedad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  Descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'tipo_enfermedad',
  timestamps: false
});

module.exports = TipoEnfermedad; 