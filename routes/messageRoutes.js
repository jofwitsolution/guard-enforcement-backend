const { receiveMessage } = require('../controllers/messageController');
const express = require('express');
const router = express.Router();

router.post('/receive', receiveMessage);

module.exports = router;
