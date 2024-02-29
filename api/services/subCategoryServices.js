
const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

// @desc   Create subCatategory
// @route  Post /api/v1/subcategories
// @access Private
exports.creatSubCategory = factory.createOne(subCategoryModel);

// ↴↴ this called nested route   parent with his kids
// Get /api/v1/categories/:categoryId/subgatories

// @desc   Get list of  subcategories
// @route  Get /api/v1/subcategories
// @access Public
exports.getSubCategoris = factory.getAll(subCategoryModel);

// @desc Get spesfic subcategory
// @route Get /api/v1/subcategory/:id
// @access Public
exports.getSpecficSubCategory = factory.getOne(subCategoryModel);

// @desc    Update category
// @route   Put /api/v1/categories/:id
// @access  Private
exports.upateSubCategory = factory.updateOne(subCategoryModel);

// @desc    Delet subCategory
// @route   Delete /api/v1/subcategory/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(subCategoryModel);
