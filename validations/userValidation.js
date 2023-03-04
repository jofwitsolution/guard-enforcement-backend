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

function validateUserProfile(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().label('First name'),
    lastName: Joi.string().min(2).max(50).required().label('Last name'),
    phone: Joi.string().min(0).max(15).label('Phone'),
    address: Joi.string().min(0).max(100).label('Address'),
    country: Joi.string().min(0).max(50).label('Country'),
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
module.exports.validateUserProfile = validateUserProfile;
module.exports.validateUserLogin = validateUserLogin;
