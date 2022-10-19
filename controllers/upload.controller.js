const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);

// Téléchargement d'une image seule
module.exports.uploadProfil = async (req, res) => {
    try {
        if (
            req.file.detectedMimeType != "image/jpg" &&
            req.file.detectedMimeType != "image/png" &&
            req.file.detectedMimeType != "image/jpeg"
            )
            throw Error("invalid file"); // throw arrête le try et lance le catch

        if (req.file.size > 500000) throw Error("max size");  // throw arrête le try et lance le catch
    } catch (err) {
        const errors = uploadErrors(err)
        return res.status(201).json({ errors });
    }

    const fileName = req.body.name + ".jpg"; // chaque nouvelle photo écrasera la précédente

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    );

    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId, // l'identifiant de l'utilisateur
            { $set : {picture: "./uploads/profil/" + fileName}}, // la variable fileName permet d'être sûr que l'on remplace la même photo
            { new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) => {
                if (!err) return res.send(docs); // docs permet d'afficher les changements d'URL de la photo
                else return res.status(500).send({ message: err });
            }
        );
    } catch(err) {
        return res.status(500).send({ message: err });
    }
};
