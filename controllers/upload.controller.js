const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

module.exports.uploadProfil = async (req, res) => {
    try {
        if (
            req.file.detectedMimeType != "image/jpg" &&
            req.file.detectedMimeType != "image/png" &&
            req.file.detectedMimeType != "image/jpeg"
            )
            throw Error("invalid"); // throw arrête le try et lance le catch

        if (req.file.size > 500000) throw Error("max size");  // throw arrête le try et lance le catch
    } catch (err) {
        return res.status(201).json(err);
    }

    const fileName = req.body.name + ".jpg"; // chaque nouvelle photo écrasera la précédente

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    )
};
