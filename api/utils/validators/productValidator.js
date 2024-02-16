const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validationMiddlware = require("../../middlewares/validator_middleware");
const CategoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");
require("colors");

exports.createProdcutValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters")
    .notEmpty()
    .withMessage("product required"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("qauntity product must be required")
    .isNumeric()
    .withMessage("qauntity  must be numeric"),
  check("sold").optional().isNumeric().withMessage("must be number"),
  check("price")
    .notEmpty()
    .withMessage("price must be required")
    .isNumeric()
    .withMessage("price must be numeric")
    .isLength({ max: 32 })
    .withMessage("long price "),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("product price after discount must be numeric")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("price after discount must be lower than actual price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("available colors must be provided in array of strings"),
  check("imageCover")
    .notEmpty()
    .withMessage("product image cover must be provided"),
  check("images")
    .optional()
    .isArray()
    .withMessage("product images must be array of strings"),
  check("category")
    .notEmpty()
    .withMessage("product must be belong to a category")
    .isMongoId()
    .withMessage("category id is invalid")
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`category with  id= ${categoryId} not found in datebase `)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("invalid  id")
    .custom((subCategoryIds) =>
      subCategoryModel
        .find({ _id: { $exists: true, $in: subCategoryIds } })
        .then((result) => {
          if (result.length < 1 || result.length !== subCategoryIds.length) {
            return Promise.reject(
              new Error(`subCategory id not found in database`)
            );
          }
        })
    )
    .custom((value) => {
      if (value.length !== new Set(value).size) {
        return Promise.reject(new Error(`subCategory ids duplicated `));
      }
      return true;
    })

    .custom((val, { req }) =>
      subCategoryModel.find({ category: req.body.category }).then((result) => {
        const subCategoryIdsInDatabase = [];
        result.forEach((subcategory) => {
          subCategoryIdsInDatabase.push(subcategory._id.toString());
        });
        if (!val.every((v) => subCategoryIdsInDatabase.includes(v))) {
          return Promise.reject(
            new Error(`subCategory ids not belonging  to category`)
          );
        }
      })
    ),
  check("brand").optional().isMongoId().withMessage("invalid  id"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validationMiddlware,
];
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validationMiddlware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationMiddlware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validationMiddlware,
];
