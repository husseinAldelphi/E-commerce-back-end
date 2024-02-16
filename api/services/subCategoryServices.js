const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../models/subCategoryModel");
const ApiErrors = require("../utils/api_error");
const ApiFeatures = require("../utils/apiFeatures");
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
exports.getSubCategoris = asyncHandler(async (req, res) => {
  // build query
  const documentCounts = await subCategoryModel.countDocuments();

  const apiFeatures = new ApiFeatures(subCategoryModel.find(), req.query)
    .paginate(documentCounts)
    .filter()
    .sort()
    .search()
    .limitFields();
  // Excute query
  const { mongooseQuery, paginationResults } = apiFeatures;
  const subCatategory = await mongooseQuery;
  res.status(200).json({
    result: subCatategory.length,
    paginationResults,
    data: subCatategory,
  });
});

// @desc Get spesfic subcategory
// @route Get /api/v1/subcategory/:id
// @access Public
exports.getSpecficSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await subCategoryModel.findById(id);
  // here we don't need to know the main category
  // .populate({ path: "category", select: "name -_id" });
  if (!subCategory) {
    // res.status(404).json({ msg: `No subCategory for this ${id}` });
    return next(new ApiErrors(`No subCategory for this ${id}`, 404));
  }
  res.status(200).json({ date: subCategory });
});

// @desc    Update category
// @route   Put /api/v1/categories/:id
// @access  Private
exports.upateSubCategory = factory.updateOne(subCategoryModel);

// @desc    Delet subCategory
// @route   Delete /api/v1/subcategory/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(subCategoryModel);
