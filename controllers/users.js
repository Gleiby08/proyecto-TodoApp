const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config');


usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(400).json({ error:'Todos los espacios son requeridos'})
  };
  const userExists = await User.findOne({ email });

  if (userExists) {
    return response.status(400).json({ error: 'El email ya se encuentra en uso' });
  }  

    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
        name,
        email,
        passwordHash,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });  
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: savedUser.email,
      subject: 'Verificacion de usuario',
      html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar correo</a>`,
    });

    return response.status(201).json('Usuario creado. por favor verifica tu correo')

});

// Ruta para verificar el usuario mediante un token
usersRouter.patch('/:id/:token', async (request, response) => {
  try {
    const token = request.params.token;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const id = decodedToken.id;
    await User.findByIdAndUpdate(id, { verified: true });
    return response.sendStatus(200);
  } catch (error) {

    //Encontrar el email de usuario
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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verificacion de usuario',
      html: `<a href="${PAGE_URL}/verify/${id}/${token}">Verificar correo</a>`,
    });

return response.status(400).json({ error: 'El link ya expiro. Se ha enviado un nuevo link de verificacion' });
  }
});



module.exports = usersRouter;