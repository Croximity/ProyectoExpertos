const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const db = require('./configuraciones/db');
const authRoutes = require('./rutas/authRoutes');

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Passport middleware
require('./middlewares/passport')(passport);
app.use(passport.initialize());

// Rutas
app.use('/api/optica/auth', authRoutes);

// Sincronizar base de datos
db.sync()
  .then(() => console.log('Base de datos conectada'))
  .catch(err => console.log('Error DB:', err));

// Servidor
const PORT = process.env.puerto || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
