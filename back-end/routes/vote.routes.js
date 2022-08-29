const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Vote = require("../models/Vote.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");


router.post('/poll', (req, res, next) => {
    const {question, theme, img, description, options, voteCount} = req.body;
    Vote.create({question, theme, img, description, options, voteCount})
    .then((response) => res.status(200).json(response))
    .catch((err) => res.json(err));
})

router.get('/poll', (req, res, next) => {
    Vote.find()
      .populate('comments')
      .then((polls) => res.status(200).json(polls))
      .catch((err) => res.json(err));
  });
  
router.get('/poll/:pollId', (req, res, next) => {
    const { pollId } = req.params;
  
    Vote.findById(pollId)
      .populate('comments')
      .then((poll) => res.status(200).json(poll))
      .catch((err) => res.json(err));
  });

router.delete('/delete-poll/:pollId', (req, res, next) => {
    const {pollId} = req.params;

    Vote.findByIdAndRemove(pollId)
    .then(() => {
        res.status(200).json({message: "Deleted"})
    })
    .catch((err) => next(err))
});




module.exports = router;