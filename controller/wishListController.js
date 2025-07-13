const asyncHandler = require("express-async-handler");
const userModel = require("../model/user");

const addProductToWishlist = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Product added successfully", product: user.wishlist });
});
const deleteProductFromWishlist = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Product deleted successfully", product: user.wishlist });
});
const getAllProductWishlist = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("wishlist");
  console.log(user);
  res.status(200).json({ product: user.wishlist });
});

module.exports = {
  addProductToWishlist,
  deleteProductFromWishlist,
  getAllProductWishlist,
};
