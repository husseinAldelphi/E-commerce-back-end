const asyncHandler = require("express-async-handler");
const ApiErrors = require("../utils/api_error");
const ApiFeatures = require("../utils/apiFeatures");
// const ApiFeatures = require("../utils/apiFeatures");
exports.deleteOne = (modelONe) =>
  asyncHandler(async (req, res, next) => {
    const document = await modelONe.findByIdAndRemove(req.params.id);
    if (!document) {
      return next(new ApiErrors(`No document for this ${req.params.id}`, 404));
    }
    res.status(204).send();
  });

exports.updateOne = (modelONe) =>
  asyncHandler(async (req, res, next) => {
    const document = await modelONe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new ApiErrors(`No document for this `, 404));
    }
    res.status(200).json({ date: document });
  });

exports.createOne = (modelONe) =>
  asyncHandler(async (req, res) => {
    const newDocument = await modelONe.create(req.body);
    res.status(201).json({ data: newDocument });
  });

exports.getOne = (modelONe) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const doc = await modelONe.findById(id);
    if (!doc) {
      return next(new ApiErrors(`No doc for this ${id}`, 404));
    }
    res.status(200).json({ date: doc });
  });

exports.getAll = (modelONe, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentCounts = await modelONe.countDocuments();
    const apiFeatures = new ApiFeatures(modelONe.find(filter), req.query)
      .paginate(documentCounts)
      .filter()
      .sort()
      .search(modelName)
      .limitFields();
    // Excute query
    const { mongooseQuery, paginationResults } = apiFeatures;
    const docs = await mongooseQuery;
    res.status(200).json({
      result: docs.length,
      paginationResults,
      data: docs,
    });
  });
