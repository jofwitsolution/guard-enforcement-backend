const { sendMessage } = require("../nodemailer/contactMessage");
const messageValidations = require("../validations/messageValidation");

// @desc Send contact message
// @route POST /api/message/send-contact-message
// @access Public
const sendContactMessage = async (req, res) => {
  const { error } = messageValidations.validateContactMessage(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { fullName, email, phone, message } = req.body;

  try {
    await sendMessage({ fullName, email, phone, message });
    res.json({
      message: "Message sent successfully. We will contact you soon.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Problem sending message" });
  }
};

module.exports.sendContactMessage = sendContactMessage;
