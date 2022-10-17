const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        posterId: { // l'identifiant de la personne qui poste
            type: String,
            required: true,
        },
        message: { // message que la personne poste
            type: String,
            trim: true,
            maxlength: 500,
        },
        picture: { // image que la personne poste
            type: String,
        },
        video: { // vidéo que la personne poste
            type: String,
        },
        likers: { // Toutes les personnes qui ont aimées le post
            type: [String], // tableau avec identifiant des utilisateurs qui ont aimés un post, ce qui empêche le cumul des likes par un seul utilisateur
            required: true, // crée un pseudo vide au début de likers
        },
        comments: { 
            type:
            [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String, // commentaire de la personne
                    timestamp: Number,
                }
            ],
            required: true, // permet d'avoir le tableau créé de base
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('post', PostSchema);