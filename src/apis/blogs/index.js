import express from "express";
import createError from "http-errors";
import blogModel from "./model.js";

const blogRouter = express.Router();

blogRouter.post("/", async (req, res, next) => {
  try {
    const blog = new blogModel(req.body);
    const { _id } = await blog.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", async (req, res, next) => {
  try {
    let limit = 2;
    let skip = req.query.page ? (parseInt(req.query.page) - 1) * 2 : 0; //page 1, 1-1 0*2, 0 page 2 2-1 1*2 2, page 3 3-1 2*2 4
    const blogs = await blogModel.find().skip(skip).limit(limit).populate({
      // find({title:req.query.title})
      path: "author",
      select: "firstName lastName avatar",
    });
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const blog = await blogModel.findById(blogId).populate({
      path: "author",
      select: "firstName lastName avatar",
    });
    if (blog) {
      res.send(blog);
    } else {
      next(createError(404, `blog with the id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogUpdate = await blogModel.findByIdAndUpdate(
      req.params.blogId,
      req.body,
      { new: true, runValidators: true }
    );
    if (blogUpdate) {
      res.send(blogUpdate);
    } else {
      next(createError(404, `blog with the id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const deletedblog = await blogModel.findByIdAndDelete(req.params.blogId);
    if (deletedblog) {
      res.status(204).send();
    } else {
      next(createError(404, `blog with the id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.post("/comment/:blogId", async (req, res, next) => {
  try {
    const newComment = await blogModel.findByIdAndUpdate(
      req.params.blogId,
      {
        $push: { comment: { ...req.body, commentDate: new Date() } },
      },
      { new: true }
    );
    console.log(newComment);
    if (newComment) {
      res.send(newComment);
    } else {
      next(createError(404, `blog with the id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});


export default blogRouter;
