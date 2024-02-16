const asyncHandler = require("express-async-handler");
const ApiErrors = require("../utils/api_error");
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
