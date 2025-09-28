const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const app = require("./app");

const server = app.listen(process.env.PORT || 3300, () => {
  console.log("Server is running ...");
});

process.on("unhandledRejection", (error) => {
  console.error(`UnhandelRejection  the error ${error}`);
  server.close(() => {
    console.error("the server Shutdwon");
    process.exit(1);
  });
});
