import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: { type: "string", required: true },
    description: { type: "string", required: true },
    brand: { type: "string", required: true },
    imageUrl: { type: "string", required: true },
    price: { type: "number", required: true },
    category: { type: "string" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

export default model("product", productSchema);
