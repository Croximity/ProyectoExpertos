const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');

const Factura = require('../facturacion/Factura');
const ProductoAtributo = require('../productos/ProductoAtributo');
const Consulta = require('../gestion_cliente/Consulta');

const FacturaDetalle = db.define('FacturaDetalle', {
  idDetalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  idConsulta: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Cantidad: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  idFactura: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idProductoAtributo: {  // 🔄 NUEVA FK UNIFICADA
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'facturadetalle',
  timestamps: false
});

// Relaciones
FacturaDetalle.belongsTo(Factura, { foreignKey: 'idFactura' });
Factura.hasMany(FacturaDetalle, { foreignKey: 'idFactura' });

FacturaDetalle.belongsTo(Consulta, { foreignKey: 'idConsulta' });


FacturaDetalle.belongsTo(ProductoAtributo, {
  foreignKey: 'idProductoAtributo'
});
ProductoAtributo.hasMany(FacturaDetalle, {
  foreignKey: 'idProductoAtributo'
});


module.exports = FacturaDetalle;
