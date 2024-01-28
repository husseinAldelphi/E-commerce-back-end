const { default: slugify } = require("slugify");

const asyncHandler = require("express-async-handler");
const subCatetegoryModel = require("../models/subCategoryModel");
const ApiErrors = require("../utils/api_error");

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
exports.creatSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await subCatetegoryModel.create({
    name: name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

// ↴↴ this called nested route   parent with his kids
// Get /api/v1/categories/:categoryId/subgatories

// @desc   Get list of  subcategories
// @route  Get /api/v1/subcategories
// @access Public
exports.getSubCategoris = asyncHandler(async (req, res) => {
  // pagination
  //  req.query.page * 1 to convert to a number because it is sended as string
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subcategories = await subCatetegoryModel
    .find(req.filterObject)
    .skip(skip)
    .limit(limit);

  // .populate({ path: "category", select: "name" });
  // show only name without _id use -_id   //! in populte make addition query so now we have 2 qeury
  // .populate({ path: "category", select: "name -_id" });
  res
    .status(200)
    .json({ result: subcategories.length, page, data: subcategories });
});

// @desc Get spesfic subcategory
// @route Get /api/v1/subcategory/:id
// @access Public
exports.getSpecficSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await subCatetegoryModel.findById(id);
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
exports.upateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await subCatetegoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subCategory) {
    return next(new ApiErrors(`No subCategory for this ${id}`, 404));
  }
  res.status(200).json({ date: subCategory });
});

// @desc    Delet subCategory
// @route   Delete /api/v1/subcategory/:id
// @access  Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCatetegoryModel.findByIdAndRemove(id);
  if (!subCategory) {
    return next(new ApiErrors(`No subCategory for this ${id}`, 404));
  }
  res.status(204).send();
});
