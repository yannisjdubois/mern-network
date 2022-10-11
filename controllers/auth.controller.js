// Inscription Connexion Déconnexion
const UserModel = require('../models/user.model');



module.exports.signUp = async (req, res) {
    console.log(req.body);
    const {pseudo, email, password} = req.body

    try {
        const user = await UserModel.create({pseudo, email, password}); // La constante user attend la création des champs ... du UserModel
        res.status(201).json({ user: user._id }); // En réponse à la création du UserModel, je renvoie l'identification de l'utilisateur
    }
    catch(err) {
        res.status(200).send({ err })
    }
}