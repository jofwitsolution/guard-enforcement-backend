const Joi = require("joi");

const messageValidations = {};

messageValidations.validateContactMessage = function (data) {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(50).required().label("Full name"),
    email: Joi.string().max(50).required().email().label("Email"),
    phone: Joi.string().min(8).max(15).required().label("Phone number"),
    message: Joi.string().required().label("Message"),
  });

  return schema.validate(data);
};

module.exports = messageValidations;
