require('dotenv').config();
const sequelize = require('sequelize');

const db = new sequelize(
    process.env.NombreBase,
    process.env.UsuarioBase,
    process.env.ContrasenaBase,
{
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})
module.exports = db;
