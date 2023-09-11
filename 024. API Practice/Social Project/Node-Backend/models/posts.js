const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.SchemaTypes;
const Post = new Schema(
  {
    title: {
      type: SchemaTypes.String,
      required: true,
    },
    content: {
      type: SchemaTypes.String,
      required: true,
    },
    image: {
      type: SchemaTypes.String,
      required: true,
    },
    creator: {
      name: {
        type: SchemaTypes.String,
        required: true,
      },
    },
  },
  { timestamps: true } // Tự động thêm 2 field (createdAt, updatedAt) vào Schema
);
module.exports = mongoose.model("posts", Post);
