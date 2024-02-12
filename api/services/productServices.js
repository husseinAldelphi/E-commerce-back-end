const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ApiErrors = require("../utils/api_error");
const ApiFeatures = require("../utils/apiFeatures");
require("colors");

// @desc   Create prodcut
// @route  Post /api/v1/categories
// @access Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);

  res.status(201).json({ data: product });
});

// @desc   Get list of products
// @route  Get /api/v1/products
// @access Public
exports.getProdcuts = asyncHandler(async (req, res) => {
  // build query
  const documentCounts = await Product.countDocuments();
  console.log(documentCounts);
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .paginate(documentCounts) 
    .filter()
    .sort()
    .search()
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

  const product = await Product.findById(id).populate({
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
exports.updateProdcut = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const prodcut = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!prodcut) {
    return next(new ApiErrors(`No prodcut for this ${id}`, 404));
  }
  res.status(200).json({ date: prodcut });
});

// @desc    Delete prodcut
// @route   Delete /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const prodcut = await Product.findByIdAndRemove(id);
  if (!prodcut) {
    return next(new ApiErrors(`No prodcut for this ${id}`, 404));
  }
  res.send({
    message: `product id ${id} deleted`,
  });
});
