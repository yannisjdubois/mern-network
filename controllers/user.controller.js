const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select(-password); // récupère tous les paramètres sauf password
    res.status(200).json(users);
}