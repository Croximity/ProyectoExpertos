const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const Cliente = require('./Cliente');
const Empleado = require('./Empleado');

const Consulta = db.define('Consulta', {
  idConsulta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  FechaRegistro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Fecha_consulta: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Motivo_consulta: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  Observaciones: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  idCliente: {
    type: DataTypes.INTEGER,
    allowNull: false,

    
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false,

    
  }
}, {
  tableName: 'consulta',
  timestamps: false
});
Cliente.hasMany(Consulta,{foreignKey: "idCliente", sourceKey: 'idCliente'})
Consulta.belongsTo(Cliente, { foreignKey: 'idCliente'});
Empleado.hasMany(Consulta,{foreignKey: "idEmpleado", sourceKey: 'idEmpleado' })
Consulta.belongsTo(Empleado, { foreignKey: 'idEmpleado' });



module.exports = Consulta;
