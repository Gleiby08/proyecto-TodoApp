// Importar las dependencias necesarias
const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

// Definir el esquema del modelo de usuario
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    verified: {
        type: Boolean,
        default: false
    },
});

// Método para verificar el token de acceso
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        returnedObject.__v = undefined;
        delete returnedObject.passwordHash; 
    }
});

// Crear el modelo de usuario a partir del esquema
const User = mongoose.model('User', userSchema);

// Exportar el modelo de usuario
module.exports = User;