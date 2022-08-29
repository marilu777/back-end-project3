const { Schema, model } = require("mongoose");

const commentsSchema = new Schema(
    {
      author: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      content: { type: String, required: true },
    }
  );
  
  const Comment = model("Comment", commentsSchema)

module.exports = Comment;