const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const {
  validateUserProfile,
  validateUserSignup,
} = require('../validations/userValidation');
const validateIdentity = require('../validations/identityValidation');
const getIdentity = require('../helpers/idHelper');

// @desc Signup user
// @route Post /api/users/signup
// @Access Public
const signupUser = async (req, res, next) => {
  // ID: GE/20220001/GESP01 = 20220001

  try {
    let { firstName, lastName, identityNumber, email, password } = req.body;

    // Validation
    const { error } = validateUserSignup({
      firstName,
      lastName,
      email,
      password,
    });

    if (error) {
      // if it is the regex pattern
      if (error.details[0].context?.regex) {
        return res.status(400).json({
          message:
            'Password must contain at least one uppercase, lowercase, number and special character',
        });
      }

      return res.status(400).json({ message: error.details[0].message });
    }

    // validate identity Number
    identityNumber = identityNumber.toUpperCase();
    const idError = validateIdentity(identityNumber);
    if (idError) {
      return res.status(400).json({ message: idError });
    }

    identityNumber = getIdentity(identityNumber);
    // check if identity has not been taken
    const identityTaken = await User.findOne({ identityNumber });
    if (identityTaken) {
      return res.status(400).json({ message: 'Identity not available' });
    }

    email = email.toLowerCase();
    // check if a user with the same email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exist' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const user = new User({
      identityNumber,
      email,
      password: hashedPassword,
      profile: {
        firstName,
        lastName,
      },
    });

    await user.save();

    // generate a JSON Web Token
    const token = generateToken(
      user._id,
      user.profile.firstName,
      user.profile.lastName,
      user.role,
      user.isAdmin
    );

    res.json({
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get user profile
// @route GET /api/users/:id/profile
// @access Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -__v');

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc Update user profile
// @route Patch /api/users/:id/profile
// @access Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { error } = validateUserProfile(req.body);
    if (error) {
      res.status(400);
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;

      const updatedUser = await user.save();

      const token = generateToken({
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
      });

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        token: token,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await User.countDocuments({});
    const users = await User.find({})
      .select('-password -isAdmin -__v')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    serialNumbers = [];
    let number = 1;
    for (let i = 0; i < users.length; i++) {
      // give each user sequencial number
      serialNumbers.push(number + pageSize * (page - 1));
      number = number + 1;
    }

    res.json({
      serialNumbers,
      users,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete user
// @route DELETE /api/users/:id/delete
// @access Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: 'User successfuly removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Update user by ID
// @route Patch /api/users/:id
// @access Private/Admin
const updateUserById = async (req, res, next) => {
  try {
    const { error } = adminValidateUserProfile(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.role = req.body.role;

      const updatedUser = await user.save();
      user.password = '';

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.signupUser = signupUser;
module.exports.getUserProfile = getUserProfile;
module.exports.updateUserProfile = updateUserProfile;
module.exports.getUsers = getUsers;
module.exports.deleteUser = deleteUser;
module.exports.getUserById = getUserById;
module.exports.updateUserById = updateUserById;
