const { DataTypes } = require('sequelize');
const sequelize = require('../../configuraciones/db'); // Ajusta la ruta según tu proyecto

const Rol = sequelize.define('Rol', {
  idrol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.STRING(45),
    allowNull: true
  }
}, {
  tableName: 'rol',
  timestamps: false
});

module.exports = Rol;
