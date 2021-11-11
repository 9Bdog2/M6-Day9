import express from "express";
import createHttpError from "http-errors";
import blogPostModel from "./schema.js";

const blogRouter = express.Router();

blogRouter.get("/", async (req, res, next) => {
  try {
    const users = await blogPostModel.find();
    res.send(users);
  } catch (err) {
    next(err);
  }
});

blogRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new blogPostModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).json({ _id });
  } catch (err) {
    next(err);
  }
});

blogRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await blogPostModel.findById(req.params.userId);
    if (!user) {
      throw createHttpError(404, "User not found");
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
});

blogRouter.put("/:userId", async (req, res, next) => {
  try {
    const user = await blogPostModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      throw createHttpError(404, "User not found");
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
});

blogRouter.delete("/:userId", async (req, res, next) => {
  try {
    const user = await blogPostModel.findByIdAndDelete(req.params.userId);
    if (!user) {
      throw createHttpError(404, "User not found");
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
});

blogRouter
  .post("/:userId/comments", async (req, res, next) => {
    try {
      const comments = await blogPostModel.findById(req.params.userId, {
        _id: 0,
      });
      if (comments) {
        const commentToInsert = {
          ...req.body,
          commentDate: new Date(),
        };
        console.log(commentToInsert);
        const updatedBlog = await blogPostModel.findByIdAndUpdate(
          req.params.userId,
          { $push: { comments: commentToInsert } },
          { new: true }
        );

        if (updatedBlog) {
          res.send(updatedBlog);
        } else {
          next(
            createHttpError(404, `User with ID ${req.params.userId} not found`)
          );
        }
      } else {
        next(
          createHttpError(404, `Comment with ID ${req.params.userId} not found`)
        );
      }
    } catch (err) {
      next(err);
    }
  })
  .get("/:userId/comments", async (req, res, next) => {
    try {
      const comments = await blogPostModel.findById(req.params.userId, {
        comments: 1,
      });
      if (comments) {
        res.send(comments.comments);
      } else {
        next(
          createHttpError(404, `User with ID ${req.params.userId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  });

blogRouter
  .get("/:userId/comments/:commentId", async (req, res, next) => {
    try {
      const comment = await blogPostModel.findById(req.params.userId);
      if (comment) {
        const commentToStore = comment.comments.find(
          (comment) => comment._id.toString() === req.params.commentId
        );
        if (commentToStore) {
          res.send(commentToStore);
        } else {
          next(
            createHttpError(
              404,
              `Comment with ID ${req.params.commentId} not found`
            )
          );
        }
      } else {
        next(
          createHttpError(404, `User with ID ${req.params.userId} not found`)
        );
      }
    } catch (err) {
      next(err);
    }
  })
  .delete("/:userId/comments/:commentId", async (req, res, next) => {
    try {
      const modifiedBlog = await blogPostModel.findByIdAndUpdate(
        req.params.userId,
        { $pull: { comments: { _id: req.params.commentId } } },
        { new: true }
      );
      if (modifiedBlog) {
        res.send(modifiedBlog);
      } else {
        next(
          createHttpError(
            404,
            `Comment with ID ${req.params.commentId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  })
  .put("/:userId/comments/:commentId", async (req, res, next) => {
    try {
      const blog = await blogPostModel.findById(req.params.userId);
      if (blog) {
        const index = blog.comments.findIndex(
          (p) => p._id.toString() === req.params.commentId
        );

        if (index !== -1) {
          blog.comments[index] = {
            ...blog.comments[index].toObject(),
            ...req.body,
          };
          await blog.save();
          res.send(blog);
        } else {
          next(
            createHttpError(
              404,
              `Comment with ID ${req.params.commentId} not found`
            )
          );
        }
      } else {
        next(
          createHttpError(404, `User with ID ${req.params.userId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  });

export default blogRouter;
