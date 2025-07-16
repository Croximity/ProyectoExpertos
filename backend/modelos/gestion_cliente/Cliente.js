
const { DataTypes } = require('sequelize');
const db  = require('../../configuraciones/db');
const Persona = require('../../modelos/seguridad/Persona');
const Cliente = db.define('Cliente', {
  idCliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaRegistro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
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
  tableName: 'cliente',
  timestamps: false
});

// Relaciones
Cliente.belongsTo(Persona, { foreignKey: 'idPersona', as: 'persona' });
Persona.hasOne(Cliente, { foreignKey: 'idPersona'});
module.exports = Cliente;
// Exporta el modelo Cliente para su uso en otras partes de la aplicación
// Puedes usar este modelo para realizar operaciones CRUD en la tabla cliente           
