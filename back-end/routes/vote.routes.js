const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Vote = require("../models/Vote.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const { options } = require("./auth.routes");

router.post("/Addpoll", (req, res, next) => {
  const { question, theme, img, description, options, voteCount } = req.body;
  Vote.create({ question, theme, img, description, options, voteCount })
    .then((response) => res.status(200).json(response))
    .catch((err) => res.json(err));
});

router.get("/poll", (req, res, next) => {
  Vote.find()
    .populate("comments")
    .then((polls) => res.status(200).json(polls))
    .catch((err) => res.json(err));
});


router.get("/poll/:pollId", (req, res, next) => {
    const { pollId } = req.params;
    
    Vote.findById(pollId)
    .populate("comments")
    .then((poll) => res.status(200).json(poll))
    .catch((err) => res.json(err));
});

router.put("/poll/:pollId", async (req, res, next) => {
  const { pollId } = req.params;
  const { optionId } = req.body;

  try {
    const findOne =  (arr, id) => {
         const find = arr.map((el) => {
           if (el._id.toString() === id) {
            el.voteCount += 1;
           };
         });

         return arr;
    };

    const pollSelected = await Vote.findById(pollId);
    const newOptions = findOne(pollSelected.options, optionId)
    console.log(newOptions)


    const newPoll = await Vote.findByIdAndUpdate(pollId, {
        question: "test",
      options: newOptions,
    }, {new: true});

    res.status(200).json({newPoll});
  } catch (error) {
    next(error);
  }

  /* Poll.findByIdAndUpdate(pollId, {
        options
    }) */

  /* const {options.text} = text;
    const {options.voteCount} = voteCount;

    const {text, voteCount} = req.body; 
       Vote.getElementById('submit').onclick = function() {
        let select = document.getElementById('polls');
        let selected = [...options.voteCount]
            .filter(options => options.selected)
            .map(options => options.value)
            .catch((err) => res.json(err));
    } */

  /*   Poll.findByIdAndUpdate(pollId, {text, voteCount}, {new:true})
    .then((text) => res.status(201).json(text))
    .then((voteCount) => res.status(201).json(voteCount))
    .catch((err) => res.json(err)); */
});

router.delete("/delete-poll/:pollId", (req, res, next) => {
  const { pollId } = req.params;

  Vote.findByIdAndRemove(pollId)
    .then(() => {
      res.status(200).json({ message: "Deleted" });
    })
    .catch((err) => next(err));
});

module.exports = router;
