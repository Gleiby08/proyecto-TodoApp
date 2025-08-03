// Importar las dependencias necesarias
const mongoose = require('mongoose');


// Este esquema define la estructura de los documentos de usuario en la base de datos
// new mongoose.Schema crea un nuevo esquema de Mongoose
const todoSchema = new mongoose.Schema({
    text: String,
    checked: Boolean,
   user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
   }
    
});

// Método para verificar el token de acceso
todoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        returnedObject.__v = undefined;
        delete returnedObject._id;
        delete returnedObject.__v;
        
    }
});

// Crear el modelo de usuario a partir del esquema
const Todo = mongoose.model('Todo', todoSchema);

// Exportar el modelo de usuario
module.exports = Todo;