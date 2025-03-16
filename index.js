const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
var morgan = require("morgan");
dotenv.config({ path: ".env" });
const CategoryRouter = require("./routes/categoryRoutes");
const subCategoryRouter = require("./routes/subCategoryRoutes");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const mongoose = require("mongoose");
const ApiError = require("./utlis/globalError");
const brandRoute = require("./routes/brandRoute");
const ProductRouter = require("./routes/productRoutes");
const ReviewRouter = require("./routes/reviewRoute");
var app = express();
const connectToDb = async () => {
  //   try {
  await mongoose.connect(process.env.URL);
  console.log("Connected to MongoDB!");
  //   }catch(error){
  //     console.log('some error in connection the database')
  // }
};
connectToDb();
app.use(express.json());
// Serve static files from the "uploads" directory and its subdirectories
app.use(express.static(path.join(__dirname, "uploads")));
app.use(morgan("combined"));
app.use("/api/v1/category", CategoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/brand", brandRoute);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", ReviewRouter);
app.all("*", (req, res, next) => {
  const error = ApiError.create("this route no correct", 404, "error");
  next(error);
  //   res.status(404).json({ message: "this route not found " });
});
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  res.status(error.statusCode || 500).json({
    message: error.message,
    text: error.text,
    error: error,
    stack: error.stack,
  });
});
const server = app.listen(process.env.PORT || 3300, () => {
  console.log("Server is running ...");
});

// handel rejection outside the express
process.on("unhandledRejection", (error) => {
  console.error(`UnhandelRejection  the error ${error}`);
  server.close(() => {
    console.error("the server Shutdwon");
    process.exit(1);
  });
});
