/* eslint-disable import/no-extraneous-dependencies */
const multer = require("multer");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const CategoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");

const { uploadSingleImage } = require("../middlewares/uploadImage_middleware");
// 1- dist storage
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/category");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1]; //  mimetype: 'image/jpeg'
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;

//     cb(null, filename);
//   },
// });

// };

exports.uploadCategoryImg = uploadSingleImage("image");

exports.resizeImg = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/category/${filename}`);
  req.body.image = filename;
  next();
});

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
