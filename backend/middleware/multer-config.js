const multer = require('multer');

const MIME_TYPES = { // biblio de mime types
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// objet de configuration pour les fichiers entrants
const storage = multer.diskStorage({            //on enregistre sur le disque
  destination: (req, file, callback) => {                   // indique ou enregistrer les fichiers
    callback(null, 'images');                               // pas d'erreurs, dossier images
  },
  filename: (req, file, callback) => {          // indique le nom des fichiers
    const name = file.originalname.split(' ').join('_');    // récupère le nom d'origine et remplace les espaces par _
    const extension = MIME_TYPES[file.mimetype];            //  récup extension correspondant au mime-type du fichier téléchargé(front)
    callback(null, name + Date.now() + '.' + extension);    
    // nom + timestamp( correspond au moment présent(ms since 1/1/70)) + . + extension
  }
});

module.exports = multer({storage: storage}).single('image'); 
// exporte l'élement multer, constante storage //single = fichier unique //il s'agit d'images