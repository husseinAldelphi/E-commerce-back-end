const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiErrors = require("../utils/api_error");
const brandModel = require("../models/brandModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
// @desc   Create brand
// @route  Post /api/v1/brands
// @access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await brandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @desc   Get list of brands
// @route  Get /api/v1/brands
// @access Public
exports.getBrands = asyncHandler(async (req, res) => {
  // build query
  const documentCounts = await brandModel.countDocuments();

  const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
    .paginate(documentCounts)
    .filter()
    .sort()
    .search()
    .limitFields();
  // Excute query
  const { mongooseQuery, paginationResults } = apiFeatures;
  const brands = await mongooseQuery;
  res
    .status(200)
    .json({ result: brands.length, paginationResults, data: brands });
});

// @desc Get spesfic brand
// @route Get /api/v1/brands/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findById(id);
  if (!brand) {
    return next(new ApiErrors(`No brand for this ${id}`, 404));
  }
  res.status(200).json({ date: brand });
});

// @desc    Update brand
// @route   Put /api/v1/brands/:id
// @access  Private
exports.updateBrand =  factory.updateOne(brandModel)

// @desc    Delet brand
// @route   Delete /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(brandModel);
