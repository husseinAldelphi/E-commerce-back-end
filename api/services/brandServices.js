const brandModel = require("../models/brandModel");

const factory = require("./handlersFactory");
// @desc   Create brand
// @route  Post /api/v1/brands
// @access Private
exports.createBrand = factory.createOne(brandModel);

// @desc   Get list of brands
// @route  Get /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(brandModel);

// @desc Get spesfic brand
// @route Get /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(brandModel);

// @desc    Update brand
// @route   Put /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(brandModel);

// @desc    Delet brand
// @route   Delete /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(brandModel);
