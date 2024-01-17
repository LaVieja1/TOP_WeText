const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate_token } = require('../middlewares/authMiddleware');

// SIGN UP
router.post('/signup', userController.check_email, userController.create_user);

// LOGIN
router.post('/login', userController.login);

// SEARCH USER
router.get('/', validate_token, userController.searchUser);

// GET USER DATA
router.get('/:userId', validate_token, userController.get_user_data);

// UPDATE USER
router.post('/:userId', validate_token, userController.update_user);