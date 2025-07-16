const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');

const FormaPago = db.define('FormaPago', {
  idFormaPago: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  Formapago: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Estado: {
    type: DataTypes.STRING(1),
    allowNull: true
  }
}, {
  tableName: 'formapago',
  timestamps: false
});

module.exports = FormaPago;
