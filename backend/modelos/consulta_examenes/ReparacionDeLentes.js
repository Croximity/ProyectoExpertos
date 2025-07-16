const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const Consulta = require('../gestion_cliente/Consulta');

const ReparacionDeLentes = db.define('ReparacionDeLentes', {
  idReparacionDeLentes: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Tipo_Reparacion: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  idConsulta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'consulta',
      key: 'idConsulta'
    }
  },
  Descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Costo: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
}, {
  tableName: 'reparacion_de_lentes',
  timestamps: false
});

ReparacionDeLentes.belongsTo(Consulta, { foreignKey: 'idConsulta', as: 'consulta' });

module.exports = ReparacionDeLentes; 