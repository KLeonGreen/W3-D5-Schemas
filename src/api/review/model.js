import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    comment: { type: "string", required: true },
    rate: { type: "number", required: true, min: 1, max: 5, default: 1 },
  },

  { timestamps: true }
);

export default model("Review", reviewSchema);
