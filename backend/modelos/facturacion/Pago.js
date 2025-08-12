const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const Factura = require('./Factura');
const FormaPago = require('./FormaPago');

const Pago = db.define('Pago', {
  idPago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  idFactura: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'factura',
      key: 'idFactura'
    }
  },
  monto: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  idFormaPago: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'formapago',
      key: 'idFormaPago'
    }
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activo', 'anulado'),
    defaultValue: 'activo'
  }
}, {
  tableName: 'pago',
  timestamps: false
});

// Relaciones
Pago.belongsTo(Factura, { 
  foreignKey: 'idFactura',
  as: 'factura'
});

Pago.belongsTo(FormaPago, { 
  foreignKey: 'idFormaPago',
  as: 'formaPago'
});

Factura.hasMany(Pago, { 
  foreignKey: 'idFactura',
  as: 'pagos'
});

module.exports = Pago;
