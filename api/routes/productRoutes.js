const express = require("express");
const {
  createProdcutValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  createProduct,
  getProdcuts,
  getProduct,
  updateProdcut,
  deleteProduct,
} = require("../services/productServices");

const router = express.Router();

// اختصار لان كلاهما نفس الرابط
router.route("/").get(getProdcuts).post(createProdcutValidator, createProduct);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProdcut)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
