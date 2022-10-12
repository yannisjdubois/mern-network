const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

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
        picture: {
            type: String,
            default: "./",
        },
        bio: {
            type: String,
            max: 1024,
        },
        followers: {
            type: [String] // ce tableau va contenir les identifiants des abonnés aux utilisateurs
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String]
        },
    },
    {
        timestamps: true, // ajoute le champ de la date et le l'heure à la fin de tous les champs
    }
)

// Play function before save into display: 'block'
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt(); // bcrypt génère une série de caractères pour "saler"/complexifier le mot de passe
    this.password = await bcrypt.hash(this.password, salt);
    next(); // permet de passer à la suite
});

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel //export de l'incrémentation de UserModel