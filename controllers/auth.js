
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

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
    const user = await User.findOne({ email });
    
    if (!user) {
      return next(
        new ErrorResponse("Can not send Email to this Email Address", 404)
      );
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please click to this link </p>
      <a href = ${resetUrl} clicktracking = off > ${resetUrl} </a>
    `;

    try {
      console.log(user.email);
      await sendEmail({
        to : user.email,
        subject : "password reset request",
        text : message
      })

      res.status(200).send({success : true, data : "email sent"});
    } catch (error) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined


      await user.save();
      console.log(error);
      return next(new ErrorResponse("Email Could Not be sent"), 500);
    }

  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire : {$gt : Date.now()}
    })

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success : true,
      data : "password Reset Success"
    })
  } catch (error) {
    next(error)
  }

}

const sendToken = (user, statusCode, res) => {
  const token = user.getSingnedToken();

  res.status(statusCode).json({ success: true, token });
};

export { register, login, forgotPassword, resetPassword };
