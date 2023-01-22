import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: "string", required: true },
  },
  { timestamps: true }
);

export default model("User", userSchema);
