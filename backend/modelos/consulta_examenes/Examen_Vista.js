const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const Consulta = require('../gestion_cliente/Consulta');
const Receta = require('./Receta');

const Examen_Vista = db.define('Examen_Vista', {
  idExamen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idConsulta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'consulta',
      key: 'idConsulta'
    }
  },
  Fecha_Examen: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  idReceta: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'receta',
      key: 'idReceta'
    }
  }
}, {
  tableName: 'examen_vista',
  timestamps: false
});

Examen_Vista.belongsTo(Consulta, { foreignKey: 'idConsulta', as: 'consulta' });
Examen_Vista.belongsTo(Receta, { foreignKey: 'idReceta', as: 'receta' });

module.exports = Examen_Vista; 