// modelos/productos/ProductoModel.js
const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const CategoriaProducto = require('./CategoriaProducto');

const ProductoModel = db.define('Producto', {
  idProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  idCategoriaProducto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  impuesto: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  marca: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  precioCosto: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  precioVenta: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  stockInicial: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'producto',
  timestamps: false
});

// Relaciones
CategoriaProducto.hasMany(ProductoModel, {
  foreignKey: 'idCategoriaProducto',
  sourceKey: 'idCategoriaProducto'
});

ProductoModel.belongsTo(CategoriaProducto, {
  foreignKey: 'idCategoriaProducto'
});

module.exports = ProductoModel;

