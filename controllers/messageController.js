const { sendMessage } = require('../nodemailer/contactMessage');

// @desc Receive contact message from users
// @route POST /api/message/receive
// @access Public
const receiveMessage = async (req, res) => {
  const { fullName, email, subject, telephone, message } = req.body;

  try {
    await sendMessage({ fullName, email, subject, telephone, message });
    res.json({
      message: 'Message sent successfully. We will contact you soon.',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Problem sending message' });
  }
};

module.exports.receiveMessage = receiveMessage;
