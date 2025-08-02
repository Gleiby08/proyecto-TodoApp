// controllers/login.js
const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ruta para manejar el inicio de sesión
//await para esperar la respuesta de la base de datos y seguir con el flujo de la función
//.findOne (metodo de moongose)busca un usuario por su email
loginRouter.post('/', async (request, response) => {
    const { email, password } = request.body;
    const userExist = await User.findOne({ email });

    // Verificar si el usuario existe y si su email está verificado
    // Si no existe, devuelve un error 400 con un mensaje de error
    if (!userExist) {
        return response.status(400).json({ error: 'email o contraseña invalido ' });
    }
    // Si el usuario existe pero su email no está verificado, devuelve un error 400
    //.verified es un campo booleano que verifica si el usuario ha verificado su email.por medio del link que se e envio
    if (!userExist.verified) {
        return response.status(400).json({ error: 'Tu email no esta verificado' });
    }

    // Verificar la contraseña ingresada con la contraseña almacenada en la base de datos
    //bcrypt.compare (es un metodo de la libreria bcrypt): compara la contraseña ingresada con  el hash almacenado en la base de datos
    const isCorrect = await bcrypt.compare(password, userExist.passwordHash);
    if (!isCorrect) {
        return response.status(400).json({ error: 'email o contraseña invalido' });
    }
    // Si la contraseña es correcta, se genera un token de acceso y se envía como una cookie
    //toke: se genera para autenticar al usuario en las siguientes peticiones y se ve visible en el navegador
    const userForToken = {
        id: userExist._id,
    }
    //jwt.sign (es una funcion de la libreria jwt): genera un token de acceso con el id del usuario y una clave secreta
    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });
    
    // Configuración de la cookie para el token de acceso
    //response.cookie (es un metodo de express): establece una cookie en la respuesta con el token de acceso
    response.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    });
    
    // Enviar una respuesta exitosa sin contenido
    //response.sendStatus (es un metodo de express): envía una respuesta con el estado 200 (OK)
    return response.sendStatus(200);
});

// Ruta para manejar el cierre de sesión
// Exportar el router de inicio de sesión
module.exports = loginRouter;