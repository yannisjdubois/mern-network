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


// Supprimer les informations d'utilisateurs
module.exports.deleteUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
    return res.status(400).send('ID unknown :' + req.params.id) // ..., retourne status 400 + envoie message
    
    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Successfully deleted."});
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};


module.exports.follow = async(req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
    return res.status(400).send('ID unknown :' + req.params.id) // ..., retourne status 400 + envoie message
    
    try {
        // add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id, // l'identifiant de la personne qui veut suivre
            { $addToSet: { following: req.body.idToFollow }}, // rajoute à ce qu'on vient de mettre, l'identifiant de la personne qui est suivie
            {new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs); 
                else return res.status(400).json(err);
            }
        );
        // add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow, // l'identifiant de la personne qui est suivie
            { $addToSet: { followers: req.params.id }}, // rajoute à ce qu'on vient de mettre, l'identifiant de la personne qui suit
            (err, docs) => {
                // if (!err) res.status(201).json(docs); 
                if (err) return res.status(400).json(err);
            }
        )

    } catch (err) {
        return res.status(500).json({ message: err });
    }
};


module.exports.unfollow = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
    return res.status(400).send('ID unknown :' + req.params.id) // ..., retourne status 400 + envoie message
    
    try {

    } catch (err) {
        return res.status(500).json({ message: err });
    }
};