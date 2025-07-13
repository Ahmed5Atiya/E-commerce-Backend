const asyncHandler = require("express-async-handler");
const ApiError = require("../utlis/globalError");
const cartSchema = require("../model/cart");
const Product = require("../model/product");
const couponeSchema = require("../model/coubone");
const calcTotalPrice = (cart) => {
  let sum = 0;
  cart.cartItems.map((item) => {
    sum += item.quantity * item.price;
  });
  cart.totalPrice = sum;
  cart.totalPriceAfterDiscound = undefined;
  return sum;
};
const addProductToCart = asyncHandler(async (req, res, next) => {
  let { productId, color } = req.body;
  const product = await Product.findById(productId);
  let cart = await cartSchema.findOne({ user: req.user._id });
  // first step check if there is no cart create cart for this user
  if (!cart) {
    cart = await cartSchema.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // step 2 if there this user have the cart check if the same product here increase the quantity else and this product to cart
    let productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      //   cart = await cartSchema.create({
      //     user: req.user._id,
      //     cartItems: [{ product: productId, color, price: product.price }],
      //   });
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  //   let sum = 0;
  //   cart.cartItems.map((item) => {
  //     sum += item.quantity * item.price;
  //   });
  calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    messgae: "Product item added successfuly to Cart",
    data: cart,
  });
});
const getCartForLoggedUser = asyncHandler(async (req, res, next) => {
  const cart = await cartSchema.findOne({ user: req.user._id });
  if (!cart) {
    return next(ApiError.create("there in not cart for you", 404, "fail"));
  }
  res.status(200).json({
    status: "success",
    totalItems: cart.cartItems.length,
    data: cart,
  });
});

const deleteProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await cartSchema.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } }, // if i want to delete the product from array
    { new: true }
  );
  if (!cart) {
    return next(ApiError.create("there in not cart for you", 404, "fail"));
  }
  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    message: "cart successfully deleted",
    totalItems: cart.cartItems.length,
    data: cart,
  });
});

const deleteCart = asyncHandler(async (req, res, next) => {
  const cart = await cartSchema.findOneAndDelete({ user: req.user._id });
  res.status(200).json({
    message: "cart successfully deleted",
    totalItems: cart.cartItems.length,
  });
});

const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await cartSchema.findOne({ user: req.user._id });
  if (!cart) {
    return next(ApiError.create("there in not cart for you", 404, "fail"));
  }

  const productIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.productId
  );
  if (productIndex > -1) {
    const cartItem = cart.cartItems[productIndex];
    cartItem.quantity = quantity;
    cart.cartItems[productIndex] = cartItem;
  } else {
    return next(ApiError.create("there in product for this id", 404, "fail"));
  }
  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    message: "success",
    totalItems: cart.cartItems.length,
    data: cart,
  });
});

const applayCoupone = asyncHandler(async (req, res, next) => {
  const coupone = await couponeSchema.findOne({
    name: req.body.coupone,
    expire: { $gt: Date.now() },
  });
  if (!coupone) {
    return next(
      ApiError.create("invalid coupone name or expired", 404, "fail")
    );
  }
  const cart = await cartSchema.findOne({ user: req.user._id });
  if (!cart) {
    return next(ApiError.create("there in not cart for you", 404, "fail"));
  }
  const totalPrice = cart.totalPrice;
  const totalPriceAfterCoupon = (
    totalPrice -
    (totalPrice * coupone.discound) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscound = totalPriceAfterCoupon;
  await cart.save();
  res.status(200).json({
    message: "coupon saved successfully",
    totalItems: cart.cartItems.length,
    data: cart,
  });
});
module.exports = {
  addProductToCart,
  getCartForLoggedUser,
  deleteProductFromCart,
  deleteCart,
  updateCartItemQuantity,
  applayCoupone,
};
