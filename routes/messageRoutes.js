const { sendContactMessage } = require("../controllers/messageController");
const express = require("express");
const router = express.Router();

router.post("/send-contact-message", sendContactMessage);

module.exports = router;
