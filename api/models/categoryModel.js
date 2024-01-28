const mongoose = require("mongoose");

//* 1- create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category requiered"],
      unique: [true, "category muse be uniqued"],
    },
    // A and B => shoping/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);
//* 2- create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
