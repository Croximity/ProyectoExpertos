const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const Persona = require('../../modelos/seguridad/Persona');

const Empleado = db.define('Empleado', {
  idEmpleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPersona: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  Fecha_Registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'empleado',
  timestamps: false
});

// Relaciones
Empleado.belongsTo(Persona, { foreignKey: 'idPersona', as: 'Persona' });
Persona.hasOne(Empleado,{foreignKey: "idPersona", sourceKey:"idPersona"})
module.exports = Empleado;
