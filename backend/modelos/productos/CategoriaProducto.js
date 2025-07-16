// modelos/CategoriaProducto.js
const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');

const CategoriaProducto = db.define('CategoriaProducto', {
  idCategoriaProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  marca: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'categoriaproducto',
  timestamps: false
});

module.exports = CategoriaProducto;
