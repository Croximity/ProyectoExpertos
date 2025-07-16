const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');

const Descuento = db.define('Descuento', {
  idDescuento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,           
    autoIncrement: true          
  },
  Tipo: {
    type: DataTypes.STRING(45),
    allowNull: false,            
    validate: {
      notEmpty: {
        msg: 'El tipo no puede estar vacío'
      },
      len: {
        args: [1, 45],
        msg: 'El tipo debe tener entre 1 y 45 caracteres'
      }
    }
  },
  Estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),  
    allowNull: false,
    defaultValue: 'Activo',
    validate: {
      isIn: {
        args: [['Activo', 'Inactivo']],
        msg: 'El estado debe ser Activo o Inactivo'
      }
    }
  },
  Porcentaje: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El porcentaje no puede ser negativo'
      },
      max: {
        args: [100],
        msg: 'El porcentaje no puede ser mayor a 100'
      },
      isDecimal: {
        msg: 'El porcentaje debe ser un número decimal válido'
      }
    }
  }
}, {
  tableName: 'descuento',
  timestamps: false
});

module.exports = Descuento;

