const router = require("express").Router();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Vote = require("../models/Vote.model");
const Comment = require("../models/Comment.model");

router.put('/user/:userId/edit', async (req, res, next) => {
  const {userId} = req.params;
  const {username, email, contact} = req.body;

  User.findByIdAndUpdate(userId, {username: username, email:email, contact:contact}, {new: true})
  .then((response) => res.json(response))
  .catch((err) => res.json(err));
  });

  router.get('/user/:userId', async (req, res, next) => {
    const {userId} = req.params;

  
    User.findById(userId)
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
    });


router.delete('/user/:userId', (req, res, next) => {
  const {userId} = req.params;
  const { username, email, contact, city, nif} = req.body;
  User.findByIdAndRemove(userId)
  .then((response) => {
    console.log(response);
    res.status(200).json({message: `Your profile does not exist`})})
  .catch((err) => res.json(err));
});

module.exports = router;

