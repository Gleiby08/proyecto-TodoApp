// Importar módulos necesarios
const usersRouter = require('express').Router();// Importar el modelo de usuario
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config'); // Importar la URL de la página desde el archivo de configuración


// Ruta para crear un nuevo usuario
//'/' es la ruta base del router de usuarios
//await para esperar la respuesta de la base de datos y seguir con el flujo de la función
//.findOne (metodo de moongose)busca un usuario por su email, si el usuario ya existe, retorna  un error
//retrorna un error 400 si el email ya existe
usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  if (!name || !email || !password) {
    return response
      .status(400)
      .json({ error: 'Todos los espacios son requeridos' });
  }

  // Validar que el email tenga un formato correcto
  // Verificar si el email ya existe
  //User.findOne (es un metodo de moongose): busca un usuario por su email
  const userExists = await User.findOne({ email });

  //Si el usuario ya existe, retornar un error
  if (userExists) {
    return response
      .status(400)
      .json({ error: 'El email ya se encuentra en uso' });
  }

  //Encriptar es transformar una contraseña en un código secreto
  //saltRounds: es el numero de veces que se encripta la contraseña
  //bcrypt.hash (es un metodo de la libreria bcrypt): encripta la contraseña
  //new User: crea un nuevo usuario con los datos proporcionados
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = new User({
    name,
    email,
    passwordHash,
  });

  //Guardar el usuario en la base de datos
  //newUser.save (es un metodo de moongose): guarda el usuario en la base de datos
  //jwt.sign (es una funcion de la libreria jwt): genera un token de acceso con el id del usuario y una clave secreta
  const savedUser = await newUser.save();
  const token = jwt.sign({ id: savedUser.id },process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1d',
    }
  );

  //Enviar el email de verificacion
  //nodemailer.createTransport (es un metodo de la libreria nodemailer): crea un transportador para enviar correos electronicos desde mi app de nodejs
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      //.env: es un objeto que contiene las variables de entorno definidas en el archivo .env
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


  // Configuración del transportador para enviar correos electrónicos
  //Enviar el email de verificacion
  //transporter.sendMail (es un metodo de la libreria nodemailer): envia un correo electronico
  await transporter.sendMail({
    from: process.env.EMAIL_USER, //de
    to: savedUser.email, //a
    subject: 'Verificacion de usuario',
    html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar correo</a>`,
  });

  //Retornar una respuesta al cliente
  return response.status(201).json('Usuario creado. por favor verifica tu correo');
});

// Ruta para verificar el usuario mediante un token que se envia al correo electronico
usersRouter.patch('/:id/:token', async (request, response) => {
  // Verificar el token y actualizar el usuario
  try {
    const token = request.params.token;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const id = decodedToken.id;
    await User.findByIdAndUpdate(id, { verified: true });
    return response.sendStatus(200);

  } catch (error) {
    const id = request.params.id;
    const { email } = await User.findById(id);

    //Firmar el nuevo token
        const token = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
        });
    
    //Enviar el email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    //Enviar el email de verificacion
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verificacion de usuario',
      html: `<a href="${PAGE_URL}/verify/${id}/${token}">Verificar correo</a>`,
    });
    
    //Retornar un error al cliente
return response.status(400).json({ error: 'El link ya expiro. Se ha enviado un nuevo link de verificacion' });
  }
});

// Ruta para obtener todos los usuarios
module.exports = usersRouter;