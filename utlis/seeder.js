const fs = require("fs");
const dotenv = require("dotenv");
const Product = require("./../model/product"); // Adjust the path to your Product model
const mongoose = require("mongoose");
const colors = require("colors");
dotenv.config({ path: "../.env" });

const connectToDb = async () => {
  await mongoose.connect(process.env.URL);
  console.log("Connected to MongoDB!");
};
connectToDb();
// Read data
const products = JSON.parse(fs.readFileSync("./product.json"));

// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);
    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Check command line arguments to decide which function to run
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
