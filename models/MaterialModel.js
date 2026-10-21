import mongoose from "mongoose";
const { Schema } = mongoose;

const materialSchema = new Schema({
  materailName: {
    type: String,
    required: true
  },
  paperRate: {
    type: Number,
    required: true
  },
  rollRate: {
    type: Number,
    required: true
  },
  gamrige: {
    type: Number,
    required: true
  }
});

const MaterialModel =
  mongoose.models?.materialsentities || mongoose.model("materialsentities", materialSchema);

module.exports = MaterialModel;
