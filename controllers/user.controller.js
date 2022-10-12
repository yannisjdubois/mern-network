const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select(-password); // récupère tous les paramètres sauf password
    res.status(200).json(users);
}

// Chercher les informations d'un seul utilisateur
module.exports.userInfo = (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id)) // Si ObjectID qui appelle la fonction isValid ne trouve pas l'identifiant recherché, ...
    return res.status(400).send('ID unknown :' + req.params.id) // ..., retourne status 400 + envoie message
}