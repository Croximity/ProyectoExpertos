const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const Cliente = require("../../modelos/gestion_cliente/Cliente")
const Empleado = require("../../modelos/gestion_cliente/Empleado")
const FormaPago = require('../../modelos/facturacion/FormaPago');

const Factura = db.define('Factura', {
  idFactura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: true
  },
  Total_Facturado: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  Tipo_documento: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  tipoFacturacion: {
    type: DataTypes.ENUM('consulta', 'producto', 'servicio', 'mixto'),
    allowNull: true,
    defaultValue: 'mixto'
  },
  idCliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idFormaPago: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  archivo_pdf: { // Nuevo campo para el PDF
    type: DataTypes.STRING,
    allowNull: true
  },
  estadoFactura: {
  type: DataTypes.ENUM('activa', 'anulada', 'cobrada', 'pendiente'),    
    defaultValue: 'activa' 
},
}, {
  tableName: 'factura',
  timestamps: false
});

// Relaciones
Factura.belongsTo(Cliente, { 
  foreignKey: 'idCliente',
  as: 'cliente'
});

Factura.belongsTo(FormaPago, { 
  foreignKey: 'idFormaPago',
  as: 'formaPago'
});

Factura.belongsTo(Empleado, { 
  foreignKey: 'idEmpleado',
  as: 'empleado'
});

module.exports = Factura;
