const router = require("express").Router();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Vote = require("../models/Vote.model");
const Comment = require("../models/Comment.model");

router.put('/user/:userId', (req, res, next) => {
  const {userId} = req.params;
  const {username, email, contact, imgURL} = req.body;

  User.findByIdAndUpdate(userId, {username, email, contact, imgURL}, {new: true})
  .then((user) => res.status(201).json(user))
  .catch((err) => res.json(err));
  });

router.delete('/user/:userId', (req, res, next) => {
  const {userId} = req.params;
  User.findByIdAndRemove(userId)
  .then((response) => {
    console.log(response);
    res.status(200).json({message: `Your profile does not exist`})})
  .catch((err) => res.json(err));
});

module.exports = router;

