const { Schema, model } = require("mongoose");

const commentsSchema = new Schema(
    {
      author: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      content: String,
    }
  );
  
  const Comments = model("Comments", commentsSchema)

module.exports = Comments;