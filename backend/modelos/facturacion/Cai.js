const { DataTypes } = require('sequelize');  
const db = require('../../configuraciones/db');  
  
const CAI = db.define('CAI', {  
  idCAI: {  
    type: DataTypes.INTEGER,  
    primaryKey: true,  
    autoIncrement: true  
  },  
  codigoCAI: {  
    type: DataTypes.STRING(50),  
    allowNull: false,  
    unique: true  
  },  
  numeroFacturaInicio: {  
    type: DataTypes.STRING(20),  
    allowNull: false  
  },  
  numeroFacturaFin: {  
    type: DataTypes.STRING(20),  
    allowNull: false  
  },  
  fechaEmision: {  
    type: DataTypes.DATE,  
    allowNull: false  
  },  
  fechaVencimiento: {  
    type: DataTypes.DATE,  
    allowNull: false  
  },  
  resolucionSAR: {  
    type: DataTypes.STRING(50),  
    allowNull: false  
  },  
  nombreEmpresa: {  
    type: DataTypes.STRING(100),  
    allowNull: false,  
    defaultValue: 'Óptica Velásquez'  
  },  
  rtnEmpresa: {  
    type: DataTypes.STRING(20),  
    allowNull: false  
  },  
  activo: {  
    type: DataTypes.BOOLEAN,  
    defaultValue: true  
  },  
  facturasEmitidas: {  
    type: DataTypes.INTEGER,  
    defaultValue: 0  
  }  
}, {  
  tableName: 'cai',  
  timestamps: true  
});  
  
module.exports = CAI;