const { Schema, model } = require("mongoose");

const voteSchema = new Schema({
    question: { type: String, required: true },
    theme: { type: String, required: true },
    img: { type: String },
    description: { type: String, required: true },
    options: { type: [String], required: true },
    voteCount: { type: Number },
    comments: [{type: Schema.Types.ObjectId, ref:"Comment"}],
    /*selection: {[ type: ]}, */  
});
  
const Vote = model("Vote", voteSchema)

module.exports = Vote;