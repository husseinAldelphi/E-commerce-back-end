const productModel = require("../models/productModel");

const factory = require("./handlersFactory");
require("colors");

// @desc   Create prodcut
// @route  Post /api/v1/categories
// @access Private
exports.createProduct = factory.createOne(productModel);

// @desc   Get list of products
// @route  Get /api/v1/products
// @access Public
exports.getProdcuts = factory.getAll(productModel, "Products");

// @desc Get spesfic product
// @route Get /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(productModel);

// @desc    Update prodcut
// @route   Put /api/v1/products/:id
// @access  Private
exports.updateProdcut = factory.updateOne(productModel);

// @desc    Delete prodcut
// @route   Delete /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(productModel);
