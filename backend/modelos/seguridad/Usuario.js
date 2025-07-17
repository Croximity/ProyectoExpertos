const { DataTypes } = require('sequelize');
const sequelize = require('../../configuraciones/db');
const Persona = require('../seguridad/Persona')
const Rol = require('../seguridad/Rol')

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
  estado: {
    type: DataTypes.ENUM('Activo', 'Bloqueado', 'Inactivo', 'Logeado'),
    defaultValue: 'Activo'
  },
  idPersona: {
    type: DataTypes.INTEGER,
    allowNull: true  // Lo dejaremos sin relación por ahora
  },
  idrol:{
    type: DataTypes.INTEGER,
    allowNull: true
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
Usuario.belongsTo(Persona, {foreignKey:"idPersona", as: 'persona'} )
Rol.hasMany(
  Usuario,{
    foreignKey: "idrol",
    sourceKey: "idrol"
  }
)
Usuario.belongsTo(Rol,{foreignKey:"idrol"})
module.exports = Usuario;