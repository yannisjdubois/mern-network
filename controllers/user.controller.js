const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select(-password); // récupère tous les paramètres sauf password
    res.status(200).json(users);
};


// Chercher les informations d'un seul utilisateur
module.exports.userInfo = (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id)) // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
    return res.status(400).send('ID unknown :' + req.params.id) // ..., retourne status 400 + envoie message
    
    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID unknown : ' + err);
    }).select('-password');
};


// Modifier les informations d'utilisateurs
module.exports.updateUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
    return res.status(400).send('ID unknown :' + req.params.id) // ..., retourne status 400 + envoie message
    
    try {
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    bio: req.body.bio
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) => {
                if (!err) return res.send(docs);
                if (err) return res.status(500).send({ message: err });
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.deleteUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
    return res.status(400).send('ID unknown :' + req.params.id) // ..., retourne status 400 + envoie message
    
    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Successfully deleted."});
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}