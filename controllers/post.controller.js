const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId; // ObjectID vérifie que le paramètre passé existe en base de données
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

// Lire une publication
module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data :" + err);
  }).sort({ createdAt: -1 }); // permet de trier du plus récent au plus ancien
};

// Créer une publication
module.exports.createPost = async (req, res) => {
  let fileName;

  // Cette fonction IF effectue tous les contrôles nécessaires si une image est envoyée dans un post
  if (req.file != null) {
    try {
      if (
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/png" &&
        req.file.detectedMimeType != "image/jpeg"
      )
        throw Error("invalid file"); // throw arrête le try et lance le catch

      if (req.file.size > 500000) throw Error("max size"); // throw arrête le try et lance le catch
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(201).json({ errors });
    }

    fileName = req.body.posterId + Date.now() + ".jpg"; // personnalisation du nom de l'image avec l'identifiant de l'utilisateur qui poste, le moment précis de l'envoi et l'extension jpg
  }

  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    )
  );

  const newPost = new postModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file != null ? "./uploads/posts/" + fileName : "", // si jamais req.file n'est pas null, alors passe le contenu de fileName
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// Modifier une publication
module.exports.updatePost = (req, res) => {
  // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id); // ..., retourne status 400 + envoie message

  const updatedRecord = {
    message: req.body.message,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord }, // met à jour le message de l'utilisateur
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};

// Supprimer une publication
module.exports.deletePost = (req, res) => {
  // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id); // ..., retourne status 400 + envoie message

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error : " + err);
  });
};

module.exports.likePost = async (req, res) => {
  // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id); // ..., retourne status 400 + envoie message

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id }, // $addToSet rajoute à ce qu'on vient de mettre, l'identifiant de la personne qui a aimée
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id }, // $addToSet rajoute à ce qu'on vient de mettre, l'identifiant du post aimé
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.unlikePost = async (req, res) => {
  // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id); // ..., retourne status 400 + envoie message

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id }, // $addToSet retire à ce qu'on vient de mettre, l'identifiant de la personne qui a aimée
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id }, // $addToSet retire à ce qu'on vient de mettre, l'identifiant du post aimé
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

// Commenter un post
module.exports.commentPost = (req, res) => {
  // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id); // ..., retourne status 400 + envoie message

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

// Modifier les commentaires d'un post
module.exports.editCommentPost = (req, res) => {
  // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id); // ..., retourne status 400 + envoie message

  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      const theComment = docs.commments.find(
        (
          comment // Parmi les commentaires du document, trouve un commentaire précis
        ) => comment._id.equals(req.body.commentId)
      );

      if (!theComment) return res.status(404).send("Comment not found");
      theComment.text = req.body.text;

      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  // Si ObjectID qui appelle la méthode isValid ne trouve pas l'identifiant recherché, ...
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id); // ..., retourne status 400 + envoie message

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
