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

    res.status(201).json({
      success: true,
      user,
    });
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

    return next(new ErrorResponse("Please Provide an Email and password", 400))
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

    res.status(200).json({
      success: true,
      token : "sdhfwieuy78w6ihfl",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

function forgotPassword(req, res, next) {
  res.send("forgotPassword router");
}

function resetPassword(req, res, next) {
  res.send("resetPassword router");
}

export { register, login, forgotPassword, resetPassword };