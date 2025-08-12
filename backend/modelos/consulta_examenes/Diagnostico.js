const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');

const Diagnostico = db.define('Diagnostico', {
  idDiagnostico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idExamen: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idTipoEnfermedad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'diagnostico',
  timestamps: false,
  // Deshabilitar las asociaciones automáticas para evitar problemas
  freezeTableName: true
});

// Comentar las asociaciones por ahora para evitar problemas circulares
// Diagnostico.belongsTo(Examen_Vista, { foreignKey: 'idExamen', as: 'examen_vista' });
// Diagnostico.belongsTo(TipoEnfermedad, { foreignKey: 'idTipoEnfermedad', as: 'tipo_enfermedad' });

module.exports = Diagnostico; 