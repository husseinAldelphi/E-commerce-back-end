const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiErrors = require("../utils/api_error");
const brandModel  = require("../models/brandModel")
// @desc   Create brand
// @route  Post /api/v1/brands
// @access Private
exports.creatBrand = asyncHandler(async (req, res) => {
  const {name} = req.body;

  const brand = await brandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @desc   Get list of brands
// @route  Get /api/v1/brands
// @access Public
exports.getBrands = asyncHandler(async (req, res) => {
  // pagination
  //  req.query.page * 1 to convert to a number because it is sended as string
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const brands = await brandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ result: brands.length, page, data: brands });
});

// @desc Get spesfic brand
// @route Get /api/v1/brands/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findById(id);
  if (!brand) {
    // res.status(404).json({ msg: `No brand for this ${id}` });
    return next(new ApiErrors(`No brand for this ${id}`, 404));
  }
  res.status(200).json({ date: brand });
});

// @desc    Update brand
// @route   Put /api/v1/brands/:id
// @access  Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await brandModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiErrors(`No brand for this ${id}`, 404));
  }
  res.status(200).json({ date: brand });
});

// @desc    Delet brand
// @route   Delete /api/v1/brands/:id
// @access  Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findByIdAndRemove(id);
  if (!brand) {
    return next(new ApiErrors(`No brand for this ${id}`, 404));
  }
  res.status(204).send();
});
