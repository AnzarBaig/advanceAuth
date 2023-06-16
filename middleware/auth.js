import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ErrorResponse("You are Not Authorized ", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse("No user found", 404));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse("You are Not Authorized ", 401));
  }
};

export default protect;
