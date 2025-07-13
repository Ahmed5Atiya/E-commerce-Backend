const mongoose = require("mongoose");

const cartModel = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
        color: String,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscound: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const cartSchema = mongoose.model("cart", cartModel); //
module.exports = cartSchema;
