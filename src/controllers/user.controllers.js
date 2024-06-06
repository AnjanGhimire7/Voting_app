import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generatedAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access token and refresh token"
    );
  }
};

const userRegister = asyncHandler(async (req, res) => {
  const { fullName, email, password, mobileNumber, age, role } = req.body;
  //Checking that the all the fileds are empty or not
  if ([fullName, email, password].every((field) => field?.trim() === "")) {
    throw new ApiError(403, "All the field are required!!!");
  }
  //checking whether user with the email exist or not!!!
  const existedUser = await User.findOne({
    $or: [{ mobileNumber }, { email }],
  });
  if (existedUser) {
    throw new ApiError(403, "user exist with this email or mobilenumber!!!");
  }

  const adminUser = await User.findOne({ role: "Admin" });
  if (role === "Admin" && adminUser) {
    throw new ApiError(403, "User with admin role already exist");
  }
  //extracting citizenship local path
  const citizenshipLocalPath = req.file?.path;
  if (!citizenshipLocalPath) {
    throw new ApiError(403, "invalid citizenshiplocalpath!!!");
  }
  const citizenship = await uploadOnCloudinary(citizenshipLocalPath);
  if (!citizenship) {
    new ApiError(403, "citizenship is required!!!");
  }
  const user = await User.create({
    fullName,
    email,
    password,
    citizenship: citizenship?.url,
    mobileNumber,
    age,
    role,
  });

  const createdUser = await User.findById(user._id).select("-password ");
  await createdUser.save();

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Register successfully!!!"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(403, "Email is required !!!");
  }
  const user = await User.findOne({
    email,
  });
  if (!user) {
    throw new ApiError(403, "user doesn't exist!!!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(403, "user credinatals incorrect!!!");
  }
  const { accessToken } = await generatedAccessToken(user._id);

  const LogedInUser = await User.findById(user._id).select("-password ");

  return res
    .status(200)

    .json(
      new ApiResponse(
        200,
        {
          User: LogedInUser,
          accessToken,
        },
        "User logged In Successfully"
      )
    );
});
const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.validUser._id,
    {
      $unset: {
        accessTokenToken: "", // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)

    .json(new ApiResponse(200, {}, "logout Successfully!!!"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!(newPassword === confirmPassword)) {
    throw new ApiError(
      403,
      "new password and confirm password doesn't match!!!"
    );
  }

  const user = await User.findById(req.validUser?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.validUser, "current user Profile!!!"));
});

const getAllUser = asyncHandler(async (_, res) => {
  const user = await User.find();
  return res
    .status(200)
    .json(new ApiResponse(200, user, "All the user shown sucessfully !!!"));
});

export {
  userRegister,
  loginUser,
  logOut,
  changePassword,
  currentUser,
  getAllUser,
};
