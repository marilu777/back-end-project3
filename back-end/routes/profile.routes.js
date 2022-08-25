const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User.model");

router.get("/verify", isAuthenticaded, (req, res) => {
    console.log("the token: (or not)",req.payload)
    res.status(200).json(req.payload);
  });

router.post("/signup", (req, res) => {
    const {username, email, contact, city, nif, imgUrl, password} = req.body;

    if (!username) {
        return res
          .status(400)
          .json({ errorMessage: "Please provide your username." });
      }
    if (!email){
        return res
        .status(400)
        .json({ errorMessage: "Please provide your email." });
    }
    if (contact !== 9){
        return res
        .status(400)
        .json({ errorMessage: "Please provide your contact." });
    }
    if (!city){
        return res
        .status(400)
        .json({ errorMessage: "Please provide your city." });
    }
    if (nif !== 9){
        return res
        .status(400)
        .json({ errorMessage: "Please provide your NIF." });
    }
    if (password.length < 7){
        return res
        .status(400)
        .json({ errorMessage: "Your password needs to be at least 7 characters long." });
    }
})
User.findOne({ email }).then((found) => {
    if (found) {
      return res
        .status(400)
        .json({ errorMessage: "Email already taken." });
    }
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          email,
          city,
          password: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.status(201).json(user);
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage:
              "Email need to be unique. The email you chose is already in use.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
      router.post("/login", (req, res, next) => {
        const { email, password } = req.body;
      
        if (!email) {
          return res
            .status(400)
            .json({ errorMessage: "Please provide your username." });
        }
      
        if (password.length < 7) {
          return res.status(400).json({
            errorMessage: "Your password needs to be at least 8 characters long.",
          });
        }
        User.findOne({ email })
        .then((user) => {
          if (!user) {
            return res.status(400).json({ errorMessage: "Wrong email." });
          }
          bcrypt.compare(password, user.password).then((isSamePassword) => {
            if (!isSamePassword) {
              return res.status(400).json({ errorMessage: "Wrong password." });
            }
            const {_id, email} = user;  
            const payload = {_id, email};
            const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
              algorithm: 'HS256', 
              expiresIn: '3d',     
            });
            return res.status(200).json({authToken: authToken});
          });
        })
        .catch((err) => {

          next(err);

        });
    });
  });

module.exports = router;

