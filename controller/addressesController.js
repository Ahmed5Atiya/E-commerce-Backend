const asyncHandler = require("express-async-handler");
const userModel = require("../model/user");

const addAddressesToUsert = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Addresses added successfully",
    Addresses: user.addresses,
  });
});
const deleteAddressesToUser = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Addresses deleted successfully",
    Addresses: user.addresses,
  });
});
const getAllAddressesWishlist = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("addresses");
  res.status(200).json({ Addresses: user.addresses });
});

module.exports = {
  addAddressesToUsert,
  deleteAddressesToUser,
  getAllAddressesWishlist,
};
