import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    product: [{ productId: { type: mongoose.Types.ObjectId, required: true, ref: "product" }, quantity: { type: Number, required: true } }],
    status: { type: String, required: true, enum: ["Active", "Checked"] },
  },
  { timestamps: true }
);

export default model("Cart", cartSchema);
