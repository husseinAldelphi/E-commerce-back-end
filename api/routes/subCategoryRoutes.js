const express = require("express");

const {
  creatSubCategory,
  getSpecficSubCategory,
  getSubCategoris,
  upateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryServices");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
// mergeParams: allow us for accessing parameters on other routers
// ex: we need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryIdToBody, createSubCategoryValidator, creatSubCategory)
  .get(createFilterObj, getSubCategoris);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSpecficSubCategory)
  .put(updateSubCategoryValidator, upateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
