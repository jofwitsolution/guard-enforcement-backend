const Joi = require('joi');

function validateUserSignup(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().label('First name'),
    lastName: Joi.string().min(2).max(50).required().label('Last name'),
    email: Joi.string().max(50).required().email().label('Email'),
    password: Joi.string()
      .min(10)
      .max(16)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required()
      .label('Password'),
  });

  return schema.validate(user);
}

function validateUserLogin(user) {
  const schema = Joi.object({
    email: Joi.string().required().email().label('Email'),
    password: Joi.string().required().label('Password'),
  });

  return schema.validate(user);
}

module.exports.validateUserSignup = validateUserSignup;
module.exports.validateUserLogin = validateUserLogin;
