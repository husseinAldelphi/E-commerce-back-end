const mongoose = require("mongoose");

//* 1- create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand requiered"],
      unique: [true, "brand must be uniqued"],
    },
   
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

module.exports  = mongoose.model("Brand", brandSchema);


