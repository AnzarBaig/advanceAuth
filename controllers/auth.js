import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
async function register(req, res, next) {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   error: error.message,
    // }
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please Provide an Email and password", 400));
  }

  try {
    const userData = await User.findOne({ email }).select("+password");

    if (!userData) {
      return next(new ErrorResponse("Invalid Credentials", 400));
    }

    const isMatch = await userData.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    sendToken(userData, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

async function forgotPassword(req, res, next) {
  const { email } = req.body;

  try {
    const user = User.findOne({ email });

    if (!user) {
      return next(
        new ErrorResponse("Can not send Email to this Email Address", 404)
      );
    }

    const resetToken = User.getResetPasswordToken();
    await user.save();

    const getURL = `http://localhost:3000/passwordreset/${resetToken}`;

    const messsage = `
      <h1>You have requested a password reset</h1>
      <p>Please click to this link </p>
      <a href = ${getURL} clicktracking = off > ${getURL} </a>
    `;
  } catch (error) {}
}

function resetPassword(req, res, next) {
  res.send("resetPassword router");
}

const sendToken = (user, statusCode, res) => {
  const token = user.getSingnedToken();

  res.status(statusCode).json({ success: true, token });
};

export { register, login, forgotPassword, resetPassword };
