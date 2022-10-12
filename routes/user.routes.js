const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

// auth
router.post("/register", authController.signUp);

// user display: 'block',
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo); // quand j'ai le paramètre /:id, j'active la fonction userInfo contenue dans userController 
router.put('/:id', userController.updateUser); 
router.delete('/:id', userController.deleteUser); 

module.exports = router;