const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
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
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validationMiddlware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validationMiddlware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validationMiddlware,
];
