const { check } = require("express-validator");
const validationMiddlware = require("../../middlewares/validator_middleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid SubCategory id format"),
  validationMiddlware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required")
    .isLength({ min: 2 })
    .withMessage("SubCategory name is too short ")
    .isLength({ max: 32 })
    .withMessage("SubCategory name is too short "),
  validationMiddlware,
  check("category")
    .notEmpty()
    .withMessage("category parent must be required")
    .isMongoId()
    .withMessage("invalid Category id format"),
  validationMiddlware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid SubCategory id format"),
  validationMiddlware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid SubCategory id format"),
  validationMiddlware,
];
