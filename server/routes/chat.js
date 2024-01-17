const express = require('express');
const router = express.Router();
const { accessChat, findUserChats } = require('../controllers/chatController');
const { validate_token } = require('../middlewares/authMiddleware');

// ACCESS CHAT
router.post('/', validate_token, accessChat);

// FIND USER CHATS
router.get('/', validate_token, findUserChats);

module.exports = router;