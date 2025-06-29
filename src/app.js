require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const db = require('./configuraciones/db');

app.use(morgan('dev'));
app.use(express.json());
app.set('port', process.env.puerto);
db.authenticate()
    .then(async()=>{
        console.log("Se conecto con el servidor de BD");

    });
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});
app.use('/api/src/optica',require('./rutas/index'))
