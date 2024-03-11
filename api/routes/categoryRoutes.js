const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  resizeImg,
  uploadCategoryImg,
  getCategoris,
  creatCategory,
  getCategory,
  upateCategory,
  deleteCategory,
} = require("../services/categoryServices");
const subCategorisRoute = require("./subCategoryRoutes");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategorisRoute);
// اختصار لان كلاهما نفس الرابط

router
  .route("/")
  .get(getCategoris)
  .post(uploadCategoryImg, resizeImg, createCategoryValidator, creatCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(uploadCategoryImg, resizeImg, updateCategoryValidator, upateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
