const mongoose = require("mongoose");

const BrandModel = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "the name for Brand is require"],
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
BrandModel.post("init", (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
});

BrandModel.post("save", (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
});
const BrandSchema = mongoose.model("Brand", BrandModel); // Fixed typo
module.exports = BrandSchema;
