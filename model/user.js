const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetVerifid: Boolean,
    passwordExpirationCode: Date,
    password: {
      type: String,
      required: [true, "the password is required"],
      minLength: [6, "the password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "manager"],
      default: "user",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
