import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
  },

  type: {
    type: String,
  },

  time: {
    type: String,
  },

  description: {
    type: String,
  },

  lab: {
    type: String,
  },

  whyNeeded: String,
  preparation: String,
  precautions: String,
  procedure: String,
  resultMeaning: String,
});

export default mongoose.model("Test", testSchema);