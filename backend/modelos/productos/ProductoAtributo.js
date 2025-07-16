const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const ProductoModel = require('./ProductoModel');
const Atributo = require('./Atributo');

const ProductoAtributo = db.define('ProductoAtributo', {
  idProductoAtributo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProductoModel,
      key: 'idProducto'
    }
  },
  idAtributo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Atributo,
      key: 'idAtributo'
    }
  },
  stockActual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'producto_has_atributo',
  timestamps: false
});

// Relaciones (opcional para que Sequelize entienda)
ProductoModel.hasMany(ProductoAtributo, { foreignKey: 'idProducto' });
ProductoAtributo.belongsTo(ProductoModel, { foreignKey: 'idProducto' });

Atributo.hasMany(ProductoAtributo, { foreignKey: 'idAtributo' });
ProductoAtributo.belongsTo(Atributo, { foreignKey: 'idAtributo' });

module.exports = ProductoAtributo;
