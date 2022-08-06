import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    category: { type: String },
    title: { type: String },
    cover: { type: String },
    readTime: {
      type: Object,
      value: { type: Number, min: 0, max: 6 },
      unit: { type: String },
    },
    author: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    content: { type: String },
    comment: [{ comment: String, commentDate: Date }],
  },
  { timestamps: true }
);

export default model("BlogPost", blogSchema);
