const { check } = require("express-validator");
const validationMiddlware = require("../../middlewares/validator_middleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validationMiddlware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name required")
    .isLength({ min: 3 })
    .withMessage("Brand name is too short ")
    .isLength({ max: 32 })
    .withMessage("Brand name is too short "),
  validationMiddlware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validationMiddlware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validationMiddlware,
];
