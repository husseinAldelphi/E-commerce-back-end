/* eslint-disable import/no-extraneous-dependencies */
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const CategoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/api_error");
require("colors");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/category");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1]; //  mimetype: 'image/jpeg'
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;

    cb(null, filename);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Invalid file type you must provide an image", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadCategoryImg = upload.single("image");

// @desc   Create category
// @route  Post /api/v1/categories
// @access Private
exports.creatCategory = factory.createOne(CategoryModel);

// @desc   Get list of categories
// @route  Get /api/v1/categories
// @access Public
exports.getCategoris = factory.getAll(CategoryModel);
// @desc Get spesfic category
// @route Get /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(CategoryModel);

// @desc    Update category
// @route   Put /api/v1/categories/:id
// @access  Private
exports.upateCategory = factory.updateOne(CategoryModel);

// @desc    Delet category
// @route   Delete /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(CategoryModel);
