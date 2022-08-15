import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export default model("Author", authorSchema);
