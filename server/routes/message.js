const express = require('express');
const router = express.Router();
const { sendMessage, chatMessages, updateMsgsToSeen } = require('../controllers/messageController');
const { validate_token } = require('../middlewares/authMiddleware');

// SEND MESSAGE
router.post('/', validate_token, sendMessage);

// SEARCH MESSAGES FROM CHAT
router.post('/:chatId', validate_token, chatMessages);

// SEARCH MESSAGES FROM CHAT AND PUT THEM IN UNSEEN
router.post('/unseen', validate_token, updateMsgsToSeen);

module.exports = router;