const router = require("express").Router();
//const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const saltRounds = 10;
const User = require("../models/User.model");

router.get("/verify", isAuthenticated, (req, res) => {
  console.log("the token: (or not)",req.payload)
  res.status(200).json(req.payload);
})

router.post("/signup", (req, res) => {
  const {username, email, contact, city, nif, password} = req.body;
  console.log("____________", email)

  if (!email || !password || !username || !contact || !city || !nif) {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }
  /* if (contact !== 9){
    return res
    .status(400)
    .json({ errorMessage: "Please provide your contact." });
  } */
  /* if (nif !== 9){
    return res
    .status(400)
    .json({ errorMessage: "Please provide your NIF." });
  } */
  if (password.length < 7){
    return res
    .status(400)
    .json({ errorMessage: "Your password needs to be at least 7 characters long." });
  }


  User.findOne({ email })
    .then((foundUser) => {
      console.log("___________", foundUser)
      if (foundUser) {
       return res.status(400).json({ message: "User already exists." });
      }

      return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({ email, password: hashedPassword, username, contact, city, nif})
      })

      
    })
    .then((createdUser) => {
      console.log("____________________________here:" , createdUser)
      const { email, password: hashedPassword, username, contact, city, nif} = createdUser;
      const user = { email, password: hashedPassword, username, contact, city, nif};
      res.status(201).json({ user: user });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" })
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your username." });
  }
  if (password.length < 7) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 7 characters long.",
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
        const {_id, email, password, username, contact, city, nif} = user; 
        const payload = {_id, email, password, username, contact, city, nif};
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: 'HS256', 
          expiresIn: '3d',   
        });
        return res.status(200).json({authToken: authToken});
      });
    })
    .catch((err) => {
      console.log(err)
      next(err);
    });

 

});
/*


router.delete('/user/:Id', (req, res, next) => {
  const {userId} = req.params;
  User.findByIdAndRemove(userId)
  .then((user) => res.status(200).json())
  .catch((err) => res.json(err));
});
*/

module.exports = router;
