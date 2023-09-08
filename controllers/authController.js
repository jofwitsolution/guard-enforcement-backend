const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { generateToken } = require("../utils/generateToken");
const { validateUserLogin } = require("../validations/userValidation");

// @desc Login user with email and password
// @route Post /api/auth/login
// @Access Public
const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // Validation
    const { error } = validateUserLogin({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    email = email.toLowerCase();
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check if the password is correct
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate a JSON Web Token
    const token = generateToken(
      user._id,
      user.profile.firstName,
      user.profile.lastName,
      user.role,
      user.isAdmin
    );

    const oneDay = 1000 * 60 * 60 * 24;

    let isSecureCookie = false;
    let sameSiteCookie = "Lax";
    if (process.env.NODE_ENV === "production") {
      isSecureCookie = true;
      sameSiteCookie = "None";
    }

    // res.cookie("session", token, {
    //   httpOnly: false,
    //   secure: isSecureCookie,
    //   signed: false,
    //   expires: new Date(Date.now() + oneDay),
    //   sameSite: sameSiteCookie,
    // });
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isSecureCookie,
      signed: true,
      expires: new Date(Date.now() + oneDay),
      sameSite: sameSiteCookie,
    });

    res.json({
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = loginUser;
