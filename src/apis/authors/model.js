import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const authorSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String },
    password: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

authorSchema.pre("save", async function (next) {
  const author = this;

  const hashPassword = author.password;

  if (author.isModified("password")) {
    const hash = await bcrypt.hash(hashPassword, 10);

    author.password = hash;
  }
  next();
});

authorSchema.methods.toJSON = function () {
  const authorsDetails = this;
  const authorObject = authorsDetails.toObject();

  delete authorObject.password;
  delete authorObject.__v;

  return authorObject;
};

export default model("Author", authorSchema);
