const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "the name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "the email is required"],
      unique: true,
    },
    phone: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "the password is required"],
      minLength: [6, "the password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
