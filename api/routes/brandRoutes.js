const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  getBrands,
  creatBrand,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandServices");

const router = express.Router();

// اختصار لان كلاهما نفس الرابط
router.route("/").get(getBrands).post(createBrandValidator, creatBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
