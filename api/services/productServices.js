const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const ApiErrors = require("../utils/api_error");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
require("colors");

// @desc   Create prodcut
// @route  Post /api/v1/categories
// @access Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await productModel.create(req.body);

  res.status(201).json({ data: product });
});

// @desc   Get list of products
// @route  Get /api/v1/products
// @access Public
exports.getProdcuts = asyncHandler(async (req, res) => {
  // build query
  const documentCounts = await productModel.countDocuments();

  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate(documentCounts)
    .filter()
    .sort()
    .search("Products")
    .limitFields();
  // Excute query
  const { mongooseQuery, paginationResults } = apiFeatures;
  const products = await mongooseQuery;
  res
    .status(200)
    .json({ result: products.length, paginationResults, data: products });
});

// @desc Get spesfic product
// @route Get /api/v1/products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await productModel.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    // res.status(404).json({ msg: `No product for this ${id}` });
    return next(new ApiErrors(`No product for this ${id}`, 404));
  }
  res.status(200).json({ date: product });
});

// @desc    Update prodcut
// @route   Put /api/v1/products/:id
// @access  Private
exports.updateProdcut = factory.updateOne(productModel);

// @desc    Delete prodcut
// @route   Delete /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(productModel);
