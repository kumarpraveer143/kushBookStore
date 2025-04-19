import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPrice: Number,
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  coverImage: String,
  images: [String],

  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

export default bookSchema;
