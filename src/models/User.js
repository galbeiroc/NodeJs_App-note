const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');  //require bcryptjs to encrypt the password

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});


//Encrypted password
//Create method encryptPassword allow encrypt the password
UserSchema.methods.encryptPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10); //Apply the algorithm 10 times
    const hash = bcrypt.hash(password, salt); //Get the password encrypt
    return hash;
};


//Compare the passwords
//
UserSchema.methods.matchPasswords = async function(password) {
    return await bcrypt.compare(password, this.password); // the password entered by the user is compared with that of the DB. return true or false.
}


module.exports = mongoose.model('User', UserSchema);

//No se utliza la arrow function porque se necesita acceder al Scope.
//Se compara la contraseña que ingresa el usuario con la de la DB