import mongoose from "mongoose";

const cardboardSchema = new mongoose.Schema({
  cardboardname: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  heading:{
    type:String,
     required:false
  },
  img: {
    type: [String],
    required: true
  }
});

const CardItems =
  mongoose.models?.carditems || mongoose.model("carditems", cardboardSchema);

module.exports = CardItems;
