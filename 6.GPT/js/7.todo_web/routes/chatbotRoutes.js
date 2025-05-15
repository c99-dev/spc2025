const express = require('express');
const router = express.Router();

const { chat } = require('../controllers/chatbotControllers.js');

router.post('/api/chatbot', chat);

module.exports = router;
