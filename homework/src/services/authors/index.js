import express from "express";
import createHttpError from "http-errors";
import AuthorModel from "../authors/schema.js";

const authorsRouter = express.Router();

authorsRouter
  .post("/", async (req, res, next) => {
    try {
      const author = new AuthorModel(req.body);
      const { _id } = await author.save();
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  })
  .get("/", async (req, res, next) => {
    try {
      const authors = await AuthorModel.find();
      res.send(authors);
    } catch (error) {
      next(error);
    }
  });

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const author = await AuthorModel.findById(req.params.authorId);
    if (author) {
      res.send(author);
    } else {
      next(createHttpError(404, `Author with ID ${req.params.authorId} found`));
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
