const mongoose = require("mongoose");

const couponeModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the coupne name is required"],
      trim: true,
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "the coupne expired is required"],
    },
    discound: {
      type: Number,
      required: [true, "the discound price is required"],
    },
  },
  { timestamps: true }
);

const couponeSchema = mongoose.model("coupne", couponeModel);
module.exports = couponeSchema;
