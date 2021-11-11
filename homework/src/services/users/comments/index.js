import express from "express";
import q2m from "query-to-mongo";
import commentsModel from "../schema.js";

const commentsRouter = express.Router();

commentsRouter
  .post("/", async (req, res, next) => {
    try {
      const comment = await commentsModel.create(req.body);
      res.send(comment);
    } catch (error) {
      next(error);
    }
  })
  .get("/", async (req, res, next) => {
    try {
      const query = q2m(req.query);
      console.log(query);
      const total = await commentsModel.countDocuments(query.criteria);
      const comments = await commentsModel
        .find(query.criteria)
        .limit(query.options.limit)
        .skip(query.options.skip)
        .sort(query.options.sort);
      res.send({
        links: query.links("/comments", total),
        pageTotal: Math.ceil(total / query.options.limit),
        total,
        comments,
      });
    } catch (error) {
      next(error);
    }
  });

export default commentsRouter;
