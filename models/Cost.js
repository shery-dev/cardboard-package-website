import mongoose from "mongoose";

const CostSchema = new mongoose.Schema({
    labor: Number,
    printedSides: Number,
    rent: Number,
    imagePrintedSide: Number
})

const CostModel =
    mongoose.models?.costs || mongoose.model('costs', CostSchema);

module.exports = CostModel