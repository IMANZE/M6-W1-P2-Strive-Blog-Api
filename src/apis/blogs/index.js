import express from "express";
import createError from "http-errors";
import blogModel from "./model.js";
import { cloudinarySendData } from "../../lib/cloudinary.js";

const blogRouter = express.Router();

blogRouter.post("/", async (req,res,next) => {
  console.log("REQUEST BODY: ", req.body);
  try {
    const newBlog = await new blogModel(req.body);
    const savedBlog = await newBlog.save()
    res.send(savedBlog)
  } catch (error) {
    console.log(error)
    next(error)
  }
})


// blogRouter.post("/", async (req, res, next) => {
//   try {
//     const blog = new blogModel(req.body);
//     const { _id } = await blog.save();
//     res.status(201).send({ _id });
//   } catch (error) {
//     next(error);
//   }
// });

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

blogRouter.get("/comment/:blogId", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const blog = await blogModel.findById(blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(createError(404, `blog with the id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId/comment/:commentId", async (req, res, next) => {
  try {
    const { blogId, commentId } = req.params;
    const blog = await blogModel.findById(blogId);
    if (blog) {
      const getComment = blog.comment.find(
        (uniqueComment) => uniqueComment._id.toString() === commentId
      );
      if (getComment) {
        res.send(getComment);
      } else {
        next(
          createError(
            404,
            `Comment with the id ${req.params.commentId} not found`
          )
        );
      }
    } else {
      next(createError(404, `blog with the id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:blogId/comment/:commentId", async (req, res, next) => {
  try {
    const commentUpdate = await blogModel.findById(req.params.blogId);
    if (commentUpdate) {
      const putComment = commentUpdate.comment.findIndex(
        (uniqueComment) => uniqueComment._id.toString() === req.params.commentId
      );
      //-1 =  It does not exist
      if (putComment !== -1) {
        const oldComment = commentUpdate.comment[putComment].toObject();

        commentUpdate.comment[putComment] = { ...oldComment, ...req.body };
        await commentUpdate.save();
        res.send(commentUpdate);
      } else {
        next(
          createError(404, `blog with the id ${req.params.blogId} not found`)
        );
      }
    } else {
      next(createError(404, `blog with the id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:blogId/comment/:commentId", async (req, res, next) => {
  try {
    const deletedComment = await blogModel.findByIdAndUpdate(
      req.params.blogId,
      {
        $pull: { comment: { _id: req.params.commentId } },
      },
      { new: true }
    );
    if (deletedComment) {
      res.send(deletedComment);
    } else {
      next(createError(404, `blog with the id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.post("/:blogId/avatar", cloudinarySendData, async (req, res, next) => {
  try {
   console.log(req.file.path); 
  const blogAvatar = await blogModel.findByIdAndUpdate(
    req.params.blogId, 
    {
      cover:req.file.path
    },
    {
      new: true
    }
  )
  if (blogAvatar){
    res.send(blogAvatar)
  }
  } catch (error) {
   console.log(error);
   next(error)
  }
})

export default blogRouter;
