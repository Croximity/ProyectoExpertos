const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');

const Factura = require('../facturacion/Factura');
const Descuento = require('../facturacion/Descuento');

const DetalleDescuento = db.define('DetalleDescuento', {
  idFactura: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  idDescuento: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  Monto: {
    type: DataTypes.DOUBLE,
    allowNull: true
  }
}, {
  tableName: 'detalle_descuento',
  timestamps: false
});

// Relaciones
DetalleDescuento.belongsTo(Factura, { foreignKey: 'idFactura' });
DetalleDescuento.belongsTo(Descuento, { foreignKey: 'idDescuento' });

Factura.hasMany(DetalleDescuento, { foreignKey: 'idFactura' });
Descuento.hasMany(DetalleDescuento, { foreignKey: 'idDescuento' });

module.exports = DetalleDescuento;
