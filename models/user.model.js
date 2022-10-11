const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema( // Schema est un objet de la bibliothèque Mongoose
    {
        pseudo: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
            unique: true,
            trim: true // supprime les espaces en fin de saisie
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail], // isEmail est une bibliothèque de Validator qui gère la validation (true/false) de l'email saisi
            lowercase: true, // contraint la police en minuscule
            trim: true, // supprime les espaces en fin de saisie
        },
        password: {
            type: String,
            required: true,
            max: 1024, // nécessaire étant donné que la clé sera cryptée
            minLength: 6,
        },
        bio: {
            type: String,
            max: 1024,
        },
        followers: {
            type: [String] // ce tableau va contenir les identifiants des abonnés aux utilisateurs
        }
    }
)