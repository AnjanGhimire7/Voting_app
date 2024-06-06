import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      maxlength: 30,
      minlength: 6,
      index: true,
    },
    age: {
      type: Number,
      default: 16,
      required: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 30,
      minlength: 10,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
      unquie: true,
    },
    password: {
      required: [true, "Password is required!!"],
      type: String,

    },
    citizenship: {
      //cloudinary url
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Voter", "Admin"],
      default: "Voter",
    },
    isVoted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,

      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);
export { User };
