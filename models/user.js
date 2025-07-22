const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    verified: {
        type: Boolean,
        default: false
    },
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        returnedObject.__v = undefined;
        delete returnedObject.passwordHash; 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;