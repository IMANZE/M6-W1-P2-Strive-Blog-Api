import express from "express";
import createError from "http-errors";
import { cloudinaryAuthor } from "../../lib/cloudinary.js";
import { generateJWTToken } from "../../lib/tools.js";
import AuthorsModel from "./model.js";

const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const author = new AuthorsModel(req.body);
    const newAuthor = await author.save();
    res.send(newAuthor);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorsModel.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const { authorId } = req.params;
    const author = await AuthorsModel.findById(authorId);
    if (author) {
      res.send(author);
    } else {
      next(
        createError(404, `Author with the id ${req.params.authorId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const authorUpdate = await AuthorsModel.findByIdAndUpdate(
      req.params.authorId,
      req.body,
      { new: true, runValidators: true }
    );
    if (authorUpdate) {
      res.send(authorUpdate);
    } else {
      next(
        createError(404, `Author with the id ${req.params.authorId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const deletedAuthor = await AuthorsModel.findByIdAndDelete(
      req.params.authorId
    );
    if (deletedAuthor) {
      res.status(204).send();
    } else {
      next(
        createError(404, `Author with the id ${req.params.authorId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.post(
  "/:authorId/avatar",
  cloudinaryAuthor,
  async (req, res, next) => {
    try {
      console.log(req.file.path);
      const authorAvatar = await AuthorsModel.findByIdAndUpdate(
        req.params.authorId,
        {
          avatar: req.file.path,
        },
        {
          new: true,
        }
      );
      console.log(authorAvatar);
      if (authorAvatar) {
        res.send(authorAvatar);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

authorsRouter.post('/login', async (req,res,next) => {
  try {
    const {email, password } = req.body;

    const author = await AuthorsModel.checkCredentials(email, password);

    if (author) {
      const token = await generateJWTToken({
        _id: author._id,
        email: author.email
      })
      res.send({accessToken: token});
    } else {
      next(createError(401, "Credentials are not valid!"))
    }
  } catch (error) {
    next(error)
  }
})

export default authorsRouter;
