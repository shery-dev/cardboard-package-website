import mongoose from "mongoose";

const ProductBoxSchema = new mongoose.Schema({
  minOrder: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  mainType: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dimensions: {
    length: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    depth: {
      type: String,
      required: true
    }
  },
  cardboardname: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  }
});

const CardboardProduct =
  mongoose.models?.products || mongoose.model("products", ProductBoxSchema);

module.exports = CardboardProduct;