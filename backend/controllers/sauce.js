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
        const fileName = sauces.imageUrl.split('/images/')[1];  // extraction du nom du fichier à supprimer
        fs.unkink(`images/${fileName}`, () => {                 // Chemin du fichier ...
            Sauces.deleteOne({ _id: req.params.id })             // ... + Callback de suppression du fichier
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));                              
};

//Like ou Dislike la sauce*****************************************************************
exports.userLikes = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
    .then(sauces => {
        switch(req.body.like){
            case 1 :
                //if( !l'utilisateur n'a pas déjà liké){
                console.log("L'utilisateur a liké!")
                //Sauces.updateOne({ _id: req.params.id },{ $inc{ likes++ }, $push{ userId}, _id: req.params.id})
                //.then(() => res.status(200).json({ message: "Cette sauce est appréciée!"}))
                //.catch(error => res.status(400).json({ error}))
            //}
            break;

            case -1 :
                console.log("L'utilisateur a disliké!")
                // .then(() => res.status(200).json({ message: "Cette sauce ne fait pas l'unanimité!"}))
                // .catch(error => res.status(400).json({ error}))
            break;

            case 0 :
                console.log("L'utilisateur n'a ni liké, ni disliké!")
                // .then(() => res.status(200).json({ message: "L'utilisateur a annulé son avis sur cette sauce!"}))
                // .catch(error => res.status(400).json({ error}))
            break;

            default :
            throw('Temporairement indisponible!')
        }
        res.status(200).json({ message: 'Ca marche!'})
    })
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

