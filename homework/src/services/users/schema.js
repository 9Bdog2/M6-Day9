import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostsSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    readTime: {
      type: Object,
      required: true,
      nested: {
        value: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
      },
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: new mongoose.Schema({
          name: { type: String },
          comment: { type: String },
        }),
      },
    ],
    authors: { type: Schema.Types.ObjectId, ref: "Author" },
  },
  {
    timestamps: true,
  }
);

export default model("BlogPost", blogPostsSchema);
