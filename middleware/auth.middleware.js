const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');


// Middleware de vérification de l'identité de l'utilisateur connecté tout au long de la session de connexion
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {  // On passe dans la méthode Verify de JWT, le jeton en cookie, le jeton secret et un callback (afin de voir les éventuels erreurs et le jeton décodé) 
            if (err) {
                res.locals.user = null; // s'il n'y a pas de jeton, on refuse que les données d'utilisateur transitent
                res.cookie('jwt', '', { maxAge: 1 }); // '' + un maxAge à 1 milliseconde permet de retirer le jeton d'accès à l'utilisateur
                next(); // le next permet que la fonction continue
            } else {
                let user = await UserModel.findById(decodedToken);
                res.locals.user = user; // locals contient toutes les données qui transitent dont celles de l'utilisateur
                console.log(user);
                next();
            }
        }) 
    } else {
        res.locals.user = null; // s'il n'y a pas de jeton, on refuse que les données d'utilisateur transitent
        next();
    }
}