const express = require('express');
const router = express.Router();

// const { chat } = require('../controllers/chatbotControllers.js');
const { chat } = require('../controllers/chatbotFromPythonController.js');

router.post('/api/chatbot', chat);

module.exports = router;
