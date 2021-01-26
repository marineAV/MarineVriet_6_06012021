const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Modèle de données utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //attribut d'un e-mail unique
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // On applique MUV à notre schéma

module.exports = mongoose.model('User', userSchema);