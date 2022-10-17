const router = require('express').Router();
const postController = require('../controllers/post.controller');
const { route } = require('./user.routes');

route.get('/', postController.readPost);
route.post('/', postController.createPost);
route.put('/:id', postController.updatePost);
route.delete('/:id', postController.deletePost);

module.exports = router;






