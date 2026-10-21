import mongoose from "mongoose";

const FeatureProductSchema = new mongoose.Schema({
  colour: {
    type: Object,
    required: true
  },
  images: {
    type: Object,
    required: true
  },
  imageRotation:{
    type: Object,
    required: true
  },
  imagesizes:{
    type: Object,
    required: true
  },
  imagePosition:{
    type: Object,
    required: true
  },
  
  box_name: {
    type: String,
    required: true
  },
  materail:{
    type: String,
    required : true,
  },
 
});

const CardboardFeatureProdcuts =
  mongoose.models?.featureproduct || mongoose.model("featureproduct", FeatureProductSchema);

module.exports = CardboardFeatureProdcuts;