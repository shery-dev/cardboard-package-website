import mongoose from "mongoose";

const rollSchema = new mongoose.Schema({
  Type: {
    type: String,
    required: true
  },
  Rate: {
    type: Number,
    required: true
  },
  Sizes: {
    thick: [{
      Size: {
        type: Number,
        required: true
      },
      Quantity: {
        type: Number,
        required: true
      }
    }],
    thin: [{
      Size: {
        type: Number,
        required: true
      },
      Quantity: {
        type: Number,
        required: true
      }
    }]
  },
  description: {
    type: String,
    required: true
  },
  Quantity: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    required: true
  }
});
const RollModel =
  mongoose.models?.rolls || mongoose.model("rolls", rollSchema);

module.exports = RollModel;
