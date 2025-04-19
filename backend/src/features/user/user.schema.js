import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String,
    phone: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String },
  profileImage: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  addresses: [addressSchema],

  cart: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      quantity: { type: Number, default: 1 },
    },
  ],

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  emailVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default userSchema;
