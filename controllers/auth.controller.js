// Inscription Connexion Déconnexion
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


const maxAge = 3 * 24 * 60 * 60 * 1000; // jours * heures * minutes * secondes * millisecondes
const createToken = (id) => {  // La fonction createToken a en paramètre l'identifiant de l'utilisateur
    return jwt.sign({id}, process.env.TOKEN_SECRET, { // il retourne la méthode sign de jwt dans lequel on passe l'identifiant de l'utilisateur à retrouver et la variable d'environnement TOKEN_SECRET
        expiresIn: maxAge // durée de validité du cookie
    })
}

// Inscription
module.exports.signUp = async (req, res) => {
    // console.log(req.body);
    const {pseudo, email, password} = req.body // déstructuration de la donnée

    try {
        const user = await UserModel.create({pseudo, email, password}); // La constante user attend la création des champs ... du UserModel
        res.status(201).json({ user: user._id }); // En réponse à la création du UserModel, je renvoie l'identification de l'utilisateur
    } catch(err) {
        const errors = signUpErrors(err) ;
        res.status(200).send({ errors })
    }
}

// Connexion
module.exports.signIn = async (req, res) => {
    const { email, password } = req.body // déstructuration

    try {
        const user = await UserModel.login(email, password); // vérifie dans la base de données si l'utilisateur existe
        const token = createToken(user._id); // on récupère dans la base de données ce qui correspond à l'email, au password et on le stocke dans user._id
        res.cookie('jwt', token, { httpOnly: true, maxAge}); // met dans les cookies, le nom du cookie + le jeton + { httpOnly: true} qui sécurise le jeton pour qu'il soit consultable que depuis notre serveur
        res.status(200).json({ user: user._id}) // envoie un status 200 avec l'identifiant de l'utilisateur pour montrer que la connexion est réussie
    } catch (err){
        const errors = signInErrors(err) ;
        res.status(200).json({ errors })
    }
}

// Déconnexion
module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }); // '' + un maxAge à 1 milliseconde permet de retirer le jeton d'accès à l'utilisateur
    res.redirect('/'); // permet que la requète aboutisse
}