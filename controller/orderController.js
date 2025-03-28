const asyncHandler = require("express-async-handler");
const ApiError = require("../utlis/globalError");
const cartSchema = require("../model/cart");
const orderSchema = require("../model/order");
const { request } = require("express");
const { updateOne } = require("../model/user");
const Product = require("../model/product");

//@route post /api/v1/orders/cartId
//protected allowed user
const createCashOrder = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  const taxiPrice = 0;
  // 1 - get the cart order by the cartId
  const cart = await cartSchema.findById(req.params.cartId);
  if (!cart) {
    return next(ApiError.create("this cart is not available", 404, "failed"));
  }

  // 2- get order price depends on cart Price and check if (coupone is available)
  const orderPrice = cart.totalPriceAfterDiscound
    ? cart.totalPriceAfterDiscound
    : cart.totalPrice;
  const totalOrderPrice = orderPrice + taxiPrice + shippingPrice;

  // create a new order with the default payment method cash
  const order = await orderSchema.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  // 4- after creating the order decrement the product quantity and increment the sold quantity
  if (order) {
    const bulcOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulcOptions, {});

    // 5 - clear cart debend on cartId
    await cartSchema.findByIdAndDelete(req.params.cartId);
  }

  res.status(200).json({ message: "the order was successfully", data: order });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const query = req.query;
  const page = query.page * 1 || 1;
  const limit = query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  let filterObject = {};
  if (req.user.role === "user") {
    filterObject = { user: req.user._id }; // Use 'category', not 'categoryId'
  }
  const Review = await orderSchema.find(filterObject).skip(skip).limit(limit);
  res.json({ result: Review.length, page, data: Review });
});
const getOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await orderSchema.findById({ _id: id });
  if (!order) {
    return next(ApiError.create(404, "Review not found", "faild"));
  }
  res.status(200).json({ data: order });
});
//@route post /api/v1/orders/:id/pay
//protected allowed manager and admin
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await orderSchema.findById(id);
  if (!order) {
    return next(ApiError.create(404, "Order not found", "failed"));
  }

  // Update the order
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    message: "Order marked as paid",
    data: updatedOrder,
  });
});

//@route post /api/v1/orders/:id/deliver
//protected allowed manager and admin
const updateOrderToDeliverd = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await orderSchema.findById(id);
  if (!order) {
    return next(ApiError.create(404, "Order not found", "failed"));
  }

  // Update the order
  order.isDeliverd = true;
  order.isDeliverdAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    message: "Order marked as isDeliverd",
    data: updatedOrder,
  });
});
module.exports = {
  createCashOrder,
  getAllOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDeliverd,
};
