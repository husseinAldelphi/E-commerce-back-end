const { check } = require("express-validator");
const validationMiddlware = require("../../middlewares/validator_middleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validationMiddlware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name required")
    .isLength({ min: 3 })
    .withMessage("category name is too short ")
    .isLength({ max: 32 })
    .withMessage("category name is too short "),
  validationMiddlware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validationMiddlware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validationMiddlware,
];
