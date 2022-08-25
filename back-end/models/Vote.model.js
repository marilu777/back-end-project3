const { Schema, model } = require("mongoose");

const voteSchema = new Schema({
    
    Vote: [{voteRecived:_id}]
});
  
  
const Vote = model("Vote", voteSchema)

module.exports = Vote;