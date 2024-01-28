const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const ApiErrors = require("../utils/api_error");
// @desc   Create category
// @route  Post /api/v1/categories
// @access Private
exports.creatCategory = asyncHandler(async (req, res) => {
  const {name} = req.body;

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc   Get list of categories
// @route  Get /api/v1/categories
// @access Public
exports.getCategoris = asyncHandler(async (req, res) => {
  // pagination
  //  req.query.page * 1 to convert to a number because it is sended as string
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ result: categories.length, page, data: categories });
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
exports.upateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await CategoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiErrors(`No category for this ${id}`, 404));
  }
  res.status(200).json({ date: category });
});

// @desc    Delet category
// @route   Delete /api/v1/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndRemove(id);
  if (!category) {
    return next(new ApiErrors(`No category for this ${id}`, 404));
  }
  res.status(204).send();
});
