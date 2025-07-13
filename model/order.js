const mongoose = require("mongoose");
const orderModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
        color: String,
      },
    ],
    shippingAddress: {
      phone: Number,
      postalCode: String,
      city: String,
      detalis: String,
    },
    taxiPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: Number,
    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDeliverd: {
      type: Boolean,
      default: false,
    },
    isDeliverdAt: Date,
  },
  { timestamps: true }
);
// Populate user and product fields
orderModel.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email", // Add any other user fields you want to populate
  }).populate({
    path: "cartItems.product",
    select: "title price", // Add any other product fields you want to populate
  });
  next();
});
const orderSchema = mongoose.model("order", orderModel);

module.exports = orderSchema;
