import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
  Type: {
    type: String,
    required: true
  },
  Sizes: [{
    Size: {
      type: Number,
      required: true
    },
    Weight: [{
      weight_type: {
        type: Number,
        required: true
      },
      vendorName: {
        type: String,
        required: true
      },
      Rate: {
        type: Number,
        required: true
      },
      images: [String],
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
    }]
  }],
  description: {
    type: String,
    required: true
  },
  Quantity: {
    type: Number,
    required: true
  }
});

const ReelsModel = mongoose.models?.reels || mongoose.model('reels', reelSchema);

module.exports = ReelsModel;
