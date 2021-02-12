const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet'); // Protection des en-têtes HTTP
const dotenv = require('dotenv').config();
const mongoSanitize = require('express-mongo-sanitize'); //Protection contre les attaques par injection noSql

const app = express(); // on appelle la méthode qui crée una app express 

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connection à MongoDB********************************************************************************************
mongoose.connect(`mongodb+srv://${process.env.PASS_ID}:${process.env.PASS_MDP}@cluster0.tfmrb.mongodb.net/piquante?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS*************************************************************************************************************
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Accès depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Ajout des headers aux requêtes mentionnés, vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
    // Ajout des méthodes mentionnées
    next();
  });

app.use(bodyParser.json()); // parse le corps de la requête automatiquement
app.use(mongoSanitize()); 
app.use(helmet());
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); 
//middleware qui gère de manière statique les fichiers, ici, images, placé sous le dossier /images

module.exports = app;