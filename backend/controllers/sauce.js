const Sauces = require('../models/Model')
const fs = require('fs');  // File System: accès aux systémes de fichiers

// POST-Création d'une sauce*******************************************************************
exports.createSauce = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce); // Récup. du corps de la requête
    delete saucesObject._id;                         // suppression de l'id généré par le front
    const sauces = new Sauces({                       // Nouvelle sauce crée
        ...saucesObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   
        // Récupère l'url du fichier http://localhost/images/...
        likes: 0,
        dislikes: 0,
        usersliked: [],
        usersdisliked: [],
    });
    sauces.save() //infos sauvegardés
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

// GET-Récupération de toutes les sauces********************************************************
exports.getAllSauce = (req, res, next) => {
    Sauces.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

// GET-Récupération d'une sauce******************************************************************
exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

// PUT-Modification d'une sauce******************************************************************
exports.updateSauce = (req, res, next) => {
    const saucesObject = req.file ? // Si on trouve un fichier -> opérateur ternaire (if/else)
    { 
        ...JSON.parse(req.body.sauce),                          // on récup et parse l'objet sauce
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // on génère l'imageUrl

    } : { ...req.body }; // sinon on copie req.body
    Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

// DELETE-Suppression d'une sauce*******************************************************************
exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })                       // On cherche l'élément à supprimer
    .then(sauces => {
        const filename = sauces.imageUrl.split('/images/')[1];  // extraction du nom du fichier à supprimer
        fs.unlink(`images/${filename}`, () => {                 // Chemin du fichier ...
            Sauces.deleteOne({ _id: req.params.id })             // ... + Callback de suppression du fichier
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));                              
};

//Like ou Dislike la sauce*****************************************************************
exports.userLikes = (req, res, next) => {
    switch(req.body.like){
        case 1 :    // Si l'utilisateur like
            console.log("L'utilisateur a liké!")
            Sauces.updateOne({ _id: req.params.id },{ 
                $inc:{ likes: 1 }, // On ajoute 1 au like
                $push:{ usersLiked: req.body.userId }, // On envoi l'id de l'utilisateur dans le tableau "usersLiked"
                _id: req.params.id})
                .then(() => res.status(200).json({ message: "Cette sauce est appréciée!"}))
                .catch(error => res.status(400).json({ error}))
        break;

        case -1 :    // Si l'utilisateur dislike
            console.log("L'utilisateur a disliké!")
            Sauces.updateOne({ _id: req.params.id },{ 
                $inc:{ dislikes: 1 }, // On ajoute 1 au dislike
                $push:{ usersDisliked: req.body.userId }, // On envoi l'id de l'utilisateur dans le tableau "usersDisliked"
                _id: req.params.id})
                .then(() => res.status(200).json({ message: "Cette sauce ne fait pas l'unanimité!"}))
                .catch(error => res.status(400).json({ error}))
        break;

        case 0 :
            Sauces.findOne({ _id: req.params.id })
            .then((sauce) => {
                console.log("L'utilisateur n'a ni liké, ni disliké!")
                // Si l'utilisateur annule son like
                if(sauce.usersLiked.includes(req.body.userId)){ // Si on retrouve l'id de l'utilisateur dans l'array usersLiked...
                    Sauces.updateOne({ _id: req.params.id },{ 
                        $inc:{ likes: -1 }, // On retire un like
                        $pull:{ usersLiked: req.body.userId }, // et on retire l'id de l'utilisateur du tableau correspondant
                        _id: req.params.id})
                        .then(() => res.status(200).json({ message: "L'utilisateur a annulé son avis favorable sur cette sauce!"}))
                        .catch(error => res.status(400).json({ error}))
                }// Si l'utilisateur annule son dislike
                if(sauce.usersDisliked.includes(req.body.userId)){ // Si on retrouve l'id de l'utilisateur dans l'array usersDisliked
                    Sauces.updateOne({ _id: req.params.id },{ 
                        $inc:{ dislikes: -1 }, // On retire un dislike
                        $pull:{ usersDisliked: req.body.userId }, // et on retire l'id de l'utilisateur du tableau correspondant
                        _id: req.params.id})
                        .then(() => res.status(200).json({ message: "L'utilisateur a annulé son avis défavorable sur cette sauce!"}))
                        .catch(error => res.status(400).json({ error}))
                }
            })
            .catch(error => res.status(500).json({ error}))    
        break;

        default :
        throw('Temporairement indisponible!')
    }
};
        


