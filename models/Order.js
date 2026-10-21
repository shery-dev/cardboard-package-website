import mongoose from "mongoose";

// Define the Order schema
const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  shippingStatus: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  orders: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      ThreeD: {
        type: Boolean,
        required: false,
      },
      name: {
        type: String,
        required: true,
      },
      img: {
        type: String,
        required: false,
      },
      quantity: {
        type: Number,
        required: true,
      },
      pricePerPiece: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      dimension: {
        length: {
          type: String,
        },
        width: {
          type: String,
        },
        depth: {
          type: String,
        },
      },
      printedSides: {
        type: Number,
      },
      material: {
        type: String,
      },
      thickness: {
        type: Number,
      },
    },
  ],
});

// Create the Order model
const Orders = mongoose.models?.Order || mongoose.model("Order", OrderSchema);

module.exports = Orders;
