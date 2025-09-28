const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
var morgan = require("morgan");
var cors = require("cors");
const compression = require("compression");
const mongoose = require("mongoose");

dotenv.config({ path: ".env" });

const CategoryRouter = require("./routes/categoryRoutes");
const subCategoryRouter = require("./routes/subCategoryRoutes");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const ApiError = require("./utlis/globalError");
const brandRoute = require("./routes/brandRoute");
const ProductRouter = require("./routes/productRoutes");
const ReviewRouter = require("./routes/reviewRoute");
const wishListRouter = require("./routes/wishListRoute");
const AddressRouter = require("./routes/addressesRoute");
const couponeRouter = require("./routes/couponeRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");

var app = express();

// Reuse Mongo connection in serverless environments
let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

async function connectToDb() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const mongoUri = process.env.URL_DB;
    if (!mongoUri) {
      console.error("Missing env URL_DB");
      throw new Error("Missing URL_DB env var");
    }
    mongoose.set("strictQuery", false);
    cached.promise = mongoose
      .connect(mongoUri)
      .then((mongooseInstance) => {
        console.log("Connected to MongoDB!");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error(
          "MongoDB connection error:",
          err && err.message ? err.message : err
        );
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

connectToDb().catch(() => {
  // Connection errors will be logged above and surfaced to requests
});

app.use(cors());
app.use(compression());
app.use(express.json());
// Serve static files from the "uploads" directory and its subdirectories
app.use(express.static(path.join(__dirname, "uploads")));
app.use(morgan("combined"));

// quick root check
app.get("/", (req, res) => {
  res.status(200).send("API is up");
});

// simple health check endpoint for Netlify/Render
app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

// test MongoDB connection
app.get("/test-db", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    console.log("MongoDB connection state:", mongoose.connection.readyState);
    console.log("URL_DB env var exists:", !!process.env.URL_DB);

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.URL_DB);
    }

    res.json({
      status: "connected",
      readyState: mongoose.connection.readyState,
      envVar: !!process.env.URL_DB,
    });
  } catch (error) {
    console.error("DB test error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
      envVar: !!process.env.URL_DB,
    });
  }
});

app.use("/api/v1/category", CategoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/brand", brandRoute);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", ReviewRouter);
app.use("/api/v1/wishlist", wishListRouter);
app.use("/api/v1/addresses", AddressRouter);
app.use("/api/v1/coupone", couponeRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

app.all("*", (req, res, next) => {
  const error = ApiError.create("this route no correct", 404, "error");
  next(error);
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

module.exports = app;
