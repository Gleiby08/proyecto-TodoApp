//importar modulos
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

//conexion a la base de datos
(async () => {
    try {
        // Conectar a la base de datos MongoDB usando la URI de prueba
        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log('conectado a mongo DB');
    } catch (error) {
        console.error(error);
    }
})();

//Configuracion de express
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Rutas frontend
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/images', express.static(path.resolve('img')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));


// Middleware para manejar errores 404
app.use(morgan('tiny'));

//Rutas backend
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

// Ruta para manejar errores 404
module.exports = app;