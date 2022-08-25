const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  
    username: {type: String, require: true},
    email: {type: String, unique: true, require: true},
    contact: {type: Number, require: true },
    city: {type: Schema.Types.ObjectId , ref: "User", require: true},
    nif: {type: Number, unique: true, require: true },
    imgUrl: String,
    password: {type: String, unique: true, require: true, minlength: 7},
    timestamps: true,
  });


const User = model("User", userSchema);

module.exports = User;
