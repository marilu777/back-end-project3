const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Vote = require("../models/Vote.model");

router.post('/poll', (req, res, next) => {
    const {username, email, contact, city, nif, imgUrl, password} = req.body;

    Vote.create({username, email, contact, city, nif, imgUrl, password})
    .then((response) => res.status(201).json(response))
    .catch((err) => res.json(err));
})

router.get('/poll/:pollId', (req, res, next) => {
    const {pollId} = req.params;

    Vote.find(voteId)
    .populate('tasks')
    .then((project) => res.status(200).json(project))
    .catch((err) => res.json(err));
})

router.get('/poll/:pollId', (req, res, next) => {
    const {pollId} = req.params;

    Vote.findById(voteId)
    .populate('tasks')
    .then((project) => res.status(200).json(project))
    .catch((err) => res.json(err));
})





module.exports = router;