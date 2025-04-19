import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  orderItems: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      title: String,
      quantity: Number,
      price: Number,
    },
  ],

  shippingAddress: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String,
    phone: String,
  },

  paymentMethod: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },

  totalAmount: Number,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  orderedAt: { type: Date, default: Date.now },
});

export default orderSchema;
