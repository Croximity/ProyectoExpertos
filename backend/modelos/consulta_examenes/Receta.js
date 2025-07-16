const { DataTypes } = require('sequelize');
const db = require('../../configuraciones/db');
const Cliente = require("../../modelos/gestion_cliente/Cliente")
const Empleado = require("../../modelos/gestion_cliente/Empleado")

const Receta = db.define('Receta', {
  idReceta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Agudeza_Visual: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  EsferaIzquierdo: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Esfera_Derecho: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Cilindro_Izquierdo: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Cilindro_Derecho: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Eje_Izquierdo: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Eje_Derecho: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Distancia_Pupilar: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Tipo_Lente: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Diagnostico: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  idCliente: {
    type: DataTypes.INTEGER,
    allowNull: false,

    
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false,

    
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'receta',
  timestamps: false
});

Cliente.hasMany(Receta,{foreignKey: "idCliente", sourceKey: 'idCliente'})
Receta.belongsTo(Cliente, { foreignKey: 'idCliente'});
Empleado.hasMany(Receta,{foreignKey: "idEmpleado", sourceKey: 'idEmpleado' })
Receta.belongsTo(Empleado, { foreignKey: 'idEmpleado' });


module.exports = Receta; 