// const mongoose = require("mongoose");

// const categoryModel = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       require: [true, "the name for category is require"],
//       unique: true,
//       minlength: [6, "the name should be min 6 char"],
//       maxlength: [32, "the name should be the max 32 char"],
//     },
//     slug: {
//       type: String,
//       lowercase: true,
//     },
//   },
//   { timestamps: true }
// );

// const CategorySchema = mongooes.model("Category", categoryModel);
// module.exports = CategorySchema;
const mongoose = require("mongoose");

const categoryModel = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "the name for category is require"],
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
// this is for to add all the url for the images in database by using the mongoose middleware
categoryModel.post("init", (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categores/${doc.image}`;
    doc.image = imageUrl;
  }
});

categoryModel.post("save", (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categores/${doc.image}`;
    doc.image = imageUrl;
  }
});
const CategorySchema = mongoose.model("Category", categoryModel); // Fixed typo
module.exports = CategorySchema;
