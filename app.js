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
const todosRouter = require('./controllers/todos');
const logoutRouter = require("./controllers/logout");
const { MONGO_URI } = require('./config');
const { userExtractor } = require('./Middleware/auth');

//conexion a la base de datos
//mongoose.connect (es un metodo de moongose): conecta a la base de datos MongoDB usando la URI de prueba
(async () => {
    try {
        // Conectar a la base de datos MongoDB usando la URI de prueba
        await mongoose.connect(MONGO_URI);
        console.log('conectado a mongo DB');
    } catch (error) {
        console.error(error);
    }
})();

//Configuracion de express
//app.use (es un metodo de express): configura la aplicacion para que use los siguientes middlewares
//cors (es un middleware de express permite que tu aplicación frontend (la página web donde se registran e inician sesión acceda a tu API backend que maneja los registros y los inicios de sesión 
//cookieParser (es un middleware que permite leer las cookies de la peticion): permite leer las cookies de la peticion
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Rutas frontend
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/todos', express.static(path.resolve('views', 'todos')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/images', express.static(path.resolve('img')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));


// Middleware para manejar errores 404
app.use(morgan('tiny'));

//Rutas backend
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/todos',userExtractor ,todosRouter);


// Ruta para manejar errores 404
module.exports = app;