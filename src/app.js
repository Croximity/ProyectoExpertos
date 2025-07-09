const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const db = require('./configuraciones/db');
const authRoutes = require('./rutas/seguridad/authRoutes');
const personaRutas = require('./rutas/seguridad/personaRutas');
const rolRutas = require('./rutas/seguridad/rolRutas');
const Persona = require('./modelos/seguridad/Persona');
const Rol = require('./modelos/seguridad/Rol');
const Usuario = require('./modelos/seguridad/Usuario');

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Passport middleware
require('./middlewares/passport')(passport);
app.use(passport.initialize());

// Rutas
app.use('/api/optica/auth', authRoutes);
app.use('/api/optica', personaRutas);
app.use('/api/optica', rolRutas);

const startServer = async () => {
  try {
    await db.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    await Persona.sync();
    console.log('Modelo Persona sincronizado.');

    await Rol.sync();
    console.log('Modelo Rol sincronizado.');

    await Usuario.sync();
    console.log('Modelo Usuario sincronizado.');

    const PORT = process.env.puerto || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar la base de datos o el servidor:', err);
  }
};

startServer();
