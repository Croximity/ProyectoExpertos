require('dotenv').config();
const sequelize = require('sequelize');

const db = new sequelize(
    process.env.NombreBase,
    process.env.UsuarioBase,
    process.env.ContrasenaBase,
{
    host: 'localhost',
    port: 3307,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
module.exports = db;
