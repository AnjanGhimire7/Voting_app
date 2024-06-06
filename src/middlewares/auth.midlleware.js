import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
const jwtAuth = asyncHandler(async (req, _, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new ApiError(403, "token not found!!");
  }
  const incomingToken = req.headers.authorization.split(" ")[1];
  if (!incomingToken) {
    throw new ApiError(403, "unthourized user!!!");
  }
  const decodedToken = await jwt.verify(
    incomingToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  if (!decodedToken) {
    throw new ApiError(403, "invalid token!!!");
  }

  const validUser = await User.findById(decodedToken?._id).select("-password");
  req.validUser = validUser;
  next();
});
export { jwtAuth };
