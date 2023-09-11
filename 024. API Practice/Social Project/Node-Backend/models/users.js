const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.SchemaTypes;
const User = new Schema({
  name: {
    type: SchemaTypes.String,
    require: true,
  },
  email: {
    type: SchemaTypes.String,
    require: true,
  },
  password: {
    type: SchemaTypes.String,
    require: true,
  },
  status: {
    type: SchemaTypes.String,
    default: "I am new!",
  },
  posts: [
    {
      type: SchemaTypes.ObjectId,
      ref: "posts",
    },
  ],
});

module.exports = mongoose.model("users", User);
