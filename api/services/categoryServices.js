const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const ApiErrors = require("../utils/api_error");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
// @desc   Create category
// @route  Post /api/v1/categories
// @access Private
exports.creatCategory = factory.createOne(CategoryModel);

// @desc   Get list of categories
// @route  Get /api/v1/categories
// @access Public
exports.getCategoris = asyncHandler(async (req, res) => {
  // build query
  const documentCounts = await CategoryModel.countDocuments();

  const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
    .paginate(documentCounts)
    .filter()
    .sort()
    .search()
    .limitFields();
  // Excute query
  const { mongooseQuery, paginationResults } = apiFeatures;
  const categories = await mongooseQuery;
  res
    .status(200)
    .json({ result: categories.length, paginationResults, data: categories });
});

// @desc Get spesfic category
// @route Get /api/v1/categories/:id
// @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findById(id);
  if (!category) {
    // res.status(404).json({ msg: `No category for this ${id}` });
    return next(new ApiErrors(`No category for this ${id}`, 404));
  }
  res.status(200).json({ date: category });
});

// @desc    Update category
// @route   Put /api/v1/categories/:id
// @access  Private
exports.upateCategory = factory.updateOne(CategoryModel);

// @desc    Delet category
// @route   Delete /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(CategoryModel);
