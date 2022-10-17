const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema( // Schema est un objet de la bibliothèque Mongoose
    {
        pseudo: {
            type: String,
            required: true, // gère le caractère obligatoire du champs
            minlength: 3,
            maxlength: 55,
            unique: true, // oblige les informations du champs à être unique par rapport aux contenus déjà en base de données
            trim: true // supprime les espaces en fin de saisie
        },
        email: {
            type: String,
            required: true, // gère le caractère obligatoire du champs
            validate: [isEmail], // isEmail est une bibliothèque de Validator qui gère la validation (true/false) de l'email saisi
            lowercase: true, // contraint la police en minuscule
            unique: true, // oblige les informations du champs à être unique par rapport aux contenus déjà en base de données
            trim: true, // supprime les espaces en fin de saisie
        },
        password: {
            type: String,
            required: true, // gère le caractère obligatoire du champs
            max: 1024, // nécessaire étant donné que la clé sera cryptée
            minlength: 6,
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


userSchema.static.login = async function(email, password) {
    const user = await this.findOne({ email }); // trouve ce qui correspond au mail que l'on a passé en paramètre
    if (user) {
        const auth = await bcrypt.compare(password, user.password) // compare le cryptage du mot de passe à celui du paramètre password que l'on a passé
        if (auth) {
            return user;
        }
        throw Error('incorrect password'); // throw arrête tout et déclenche Error
    }
    throw Error('incorrect email') // throw arrête tout et déclenche Error
}

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel //export de l'incrémentation de UserModel