const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const Examen_Vista = require('./Examen_Vista');
const TipoEnfermedad = require('./TipoEnfermedad');

const Diagnostico = db.define('Diagnostico', {
  idDiagnostico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idExamen: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'examen_vista',
      key: 'idExamen'
    }
  },
  idTipoEnfermedad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipo_enfermedad',
      key: 'idTipoEnfermedad'
    }
  }
}, {
  tableName: 'diagnostico',
  timestamps: false
});

Diagnostico.belongsTo(Examen_Vista, { foreignKey: 'idExamen', as: 'examen_vista' });
Diagnostico.belongsTo(TipoEnfermedad, { foreignKey: 'idTipoEnfermedad', as: 'tipo_enfermedad' });

module.exports = Diagnostico; 