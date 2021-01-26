const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];           // on récupère le token dans le headers
        const decodedToken = jwt.verify(token, process.env.DB_TK);      // on décode le token
        const userId = decodedToken.userId;                            // récupère l'id dans le token
        if(req.body.userId && req.body.userId !== userId){            
            // Si on a un id dans la requête et que celui-ci est différent de celui dans le token...
            throw 'Identifiant non valide!';
        }else{
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée!'});
    }
};