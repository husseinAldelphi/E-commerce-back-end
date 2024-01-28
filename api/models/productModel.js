const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: { type: Number },
    colors: [String],
    imageCover: { type: String, required: true },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      required: true,
      allowNull: false,
      ref: "Category",
    },
    subcategories: [
      { type: mongoose.Schema.ObjectId, required: true, ref: "SubCategory" },
    ],
    
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: String,
      min: [1, "Rating must above or equal to 1"],
      max: [5, "Rating must below or equal to 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
