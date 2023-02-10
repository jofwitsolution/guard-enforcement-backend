const jwt = require('jsonwebtoken');

const generateToken = (id, firstName, lastName, role, isAdmin) => {
  return jwt.sign(
    { id, firstName, lastName, role, isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: '2d',
    }
  );
};

module.exports.generateToken = generateToken;
