import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, min: 0, max: 6, required: true },
      unit: { type: String, required: true },
    },
    author: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("BlogPost", blogSchema);
