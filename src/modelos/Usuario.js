const { DataTypes } = require('sequelize');
const sequelize = require('../configuraciones/db');
const Persona = require('../modelos/Persona')

const Usuario = sequelize.define('Usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nombre_Usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado:{
    type: DataTypes.STRING,
    allowNull: true
  },
  idPersona: {
    type: DataTypes.INTEGER,
    allowNull: false  // Lo dejaremos sin relación por ahora
  },
  idrol:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'usuario',
  timestamps: false,
});
Persona.hasOne(Usuario,{
  foreignKey: "idPersona",
  sourceKey: "idPersona"
}
)
Usuario.belongsTo(Persona, {foreignKey:"idPersona"} )
module.exports = Usuario;