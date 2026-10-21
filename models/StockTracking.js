const mongoose = require("mongoose");
const { Schema } = mongoose;

const StockTrackingSchema = new Schema({
  productType: {
    type: String,
    enum: {
      values: ["product", "cardboard", "roll", "reel"],
      message: "{VALUE} is not supported",
    },
    required: [true, "Please provide transaction type"],
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "products",
    default: null,
  },
  operation: {
    type: String,
    required: [true, "Operation is required"],
  },
  categoryType: {
    type: String,
    default: null,
  },
  productSize: {
    type: Number,
    default: null,
  },
  reelWeight: {
    type: Number,
    default: null,
  },
  reelVendor: {
    type: String,
    default: null,
  },
  time: {
    type: String, // Store the date as a string
    default: () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1
      const day = String(currentDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  quantity: {
    type: Number,
    default: null
  }
});

const StockTrackingModel =
  mongoose.models?.StockTracking || mongoose.model("StockTracking", StockTrackingSchema);

module.exports = StockTrackingModel;