const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const mailValidator = require('email-validator');
const passwordValidator = require('password-validator');

var schema = new passwordValidator();

schema      // schéma passwordValidator
.is().min(7)                     // taille min
.is().max(30)                    // taille max
.has().uppercase()               // doit contenir des majuscules
.has().lowercase()               // doit contenir des majuscules
.has().digits(2)                 // doit contenir 2 chiffres
.has().not().spaces()            // pas d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // le mdp n'est pas une de ces valeurs

// middleware de création d'un nouveau compte user*************************************************
exports.signup = (req, res, next) => {
    if(!mailValidator.validate(req.body.email) || !schema.validate(req.body.password)){ 
        //Si l'adresse mail n'est pas valide (email-validator) ou que le mdp ne correspond pas au schéma, renvoi une erreur
        throw { error }
    }else if(mailValidator.validate(req.body.email) && schema.validate(req.body.password)){
        //Si l'email est valide et que le mdp correspond au schéma alors...
    bcrypt.hash(req.body.password, 10)  // hashage du mdp dans le corps de la requête + salage
    .then(hash => {                     // puis création du nouvel utilisateur
        const user = new User({
            email: req.body.email,      // récupère l'email dans la requête
            password: hash              // mdp crypté
        });
        user.save()                     // sauvegarde du new user dans la BDD
        .then(() => res.status(200).json({ message: "Utilisateur crée"}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
    }
};

// middleware de connection**************************************************************************
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // récupère  l'email dans la requête
        .then(user => {
            if(!user){                      // Si l'utilisateur n'est pas trouvé, renvoi un msg d'erreur
                return res.status(401).json({ error: 'Utilisateur non trouvé!'});
            }
            bcrypt.compare(req.body.password, user.password) // Si user est trouvé alors on compare le mdp avec celui de la bdd
                .then(valid => {
                    if(!valid){                              // Si mdp invalide...
                        return res.status(401).json({ error: 'Le mot de passe est incorrect'});
                    }
                    res.status(200).json({                   // Si mdp valide alors renvoi...
                        userId: user._id,                    // l'id de l'utilisateur...
                        token: jwt.sign(                     // + un token, avec la fonction sign pour encoder un nouveau token
                            {userId: user._id},              // On assigne l'utilisateur
                            process.env.DB_TK,               // encodage du token
                            { expiresIn: '24h' }             // durée de validité du token
                        )                       
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};