const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId; // ObjectID vérifie que le paramètre passé existe en base de données

// Lire une publication
module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data :" + err);
  });
};

// Créer une publication
module.exports.createPost = async (req, res) => {
  const newPost = new postModel({
    posterId: req.body.posterId,
    message: req.body.message,
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

module.exports.commentPost = (req, res) => {
  
}

module.exports.editCommentPost = (req, res) => {

}

module.exports.deleteCommentPost = (req, res) => {

}
