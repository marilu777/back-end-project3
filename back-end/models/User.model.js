const { Schema, model } = require("mongoose");


const userSchema = new Schema({
  
    username: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    contact: {type: Number, required: true },
    city: {type: Schema.Types.ObjectId, ref: "User"},
    nif: {type: Number, unique: true, required: true },
    imgUrl: String,
    password: {type: String, unique: true, required: true, minlength: 7},
  }, {timestamps: true},
  );


const User = model("User", userSchema);

module.exports = User;
