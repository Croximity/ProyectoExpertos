const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const Persona = require('../../modelos/seguridad/Persona');

const Telefono = db.define('Telefono', {
  idTelefono: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Numero: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  Estado: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  idPersona: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'persona',
      key: 'idPersona'
    }
  }
}, {
  tableName: 'telefono',
  timestamps: false
});

Telefono.belongsTo(Persona, { foreignKey: 'idPersona'});
Persona.hasMany(Telefono, {foreignKey:"idPersona", sourceKey:"idPersona"})

module.exports = Telefono;
