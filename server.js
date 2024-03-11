const path = require("path");

const express = require("express");

const app = express();
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });
const morgan = require("morgan");
const dbConnnection = require("./api/config/db_connection");

dbConnnection();
const categoryRoutes = require("./api/routes/categoryRoutes");
const subCategoryRoutes = require("./api/routes/subCategoryRoutes");
const brandRoutes = require("./api/routes/brandRoutes");
const productRoutes = require("./api/routes/productRoutes");
const ApiError = require("./api/utils/api_error");
const globalError = require("./api/middlewares/error_middleware");

const port = process.env.PORT || 8000;
//! Middlewares
if (process.env.NODE_ENV === "devlopment") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

//! mount routes

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subCategoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);

app.all("*", (req, res, next) => {
  // const err = new Error(`can't find theis route ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`can't find theis route ${req.originalUrl}`, 400));
  //▼▼↓ to the global error hanlder middleware
});
//! global error hanlder middleware for express
app.use(globalError);

const server = app.listen(port, () =>
  console.log(`app is running on port ${port} `)
);
// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection  error  : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shutting down ......");
    process.exit(1);
  });
});
