// Importar las dependencias necesarias
const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');


// Este esquema define la estructura de los documentos de usuario en la base de datos
// new mongoose.Schema crea un nuevo esquema de Mongoose
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