const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ApiErrors = require("../utils/api_error");
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
  //* 1) Filtering products
  const queryStirngObject = { ...req.query };
  const excludeFields = ["page", "limit", "sort", "fields","keyword"];
  excludeFields.forEach((field) => delete queryStirngObject[field]);
  // apply filteration using [get,gt,lte,lt]
  let queryString = JSON.stringify(queryStirngObject);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  //* 2) Pagination
  //  req.query.page * 1 to convert to a number because it is sended as string
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;

  //build query
  let mongooseQuery = Product.find(JSON.parse(queryString))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  //* 3) sorting
  if (req.query.sort) {
    // price, -sold - => [price, -sold]=> price -sold
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(`${sortBy}`.red);
    //! sort(price sold) // without comma , 👇
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else mongooseQuery = mongooseQuery.sort("createdAt");
  //* 4) feildes limiting
  if (req.query.fields) {
    let fields = req.query.fields.split(",").join(" ");
    fields += " -__v";
    console.log(`${fields}`.red);
    //? if you want to response all fields except title enter it like -title
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }
  //* 5) search feature
  if (req.query.keyword) {
    const { keyword } = req.query;
    // const pattern = new RegExp(`\\b${keyword}`, 'i');
    const query = {
      $or: [
        { title: { $regex: keyword } },
        { description: { $regex: keyword } },
      ],
    };

    mongooseQuery = await mongooseQuery.find(query);
    console.log(`${JSON.stringify(query)}`.red);
    // console.log(`${mongooseQuery}`.red);
  }
  const products = await mongooseQuery;
  res.status(200).json({ result: products.length, page, data: products });
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
