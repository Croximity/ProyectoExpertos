// modelos/Atributo.js
const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');


const Atributo = db.define('Atributo', {
  idAtributo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING(45), // texto, número, etc.
    allowNull: false
  }
}, {
  tableName: 'atributo',
  timestamps: false
});

module.exports = Atributo;
