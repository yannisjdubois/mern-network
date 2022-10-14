const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');


// Middleware de vérification de l'identité de l'utilisateur connecté tout au long de la session de connexion
module.exports.checkUser = (req, res, next) => { // le next permet que la fonction continue
    const token = req.cookies.jwt;
}