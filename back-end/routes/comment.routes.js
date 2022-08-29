const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Vote = require("../models/Vote.model");
const Comment = require("../models/Comment.model");


router.post("/comment/create/:otherUserId", (req, res, next) => {
    const {otherUserId} = req.params
    const user = req.payload._id

    const id = user._id

    Comment.findOne({ resultPoll: {$all: [otherUserId, id]}})
    .then((foundResultPoll) => {
        if(foundResultPoll === null){
            Conversation.create({resultPoll: [otherUserId]})
            .then((resultPoll) => {
                console.log(resultPoll)

                res.redirect(`/poll/:pollId/`)   // front${Vote._id}
            }).catch(err => next(err))
        }
    })
});
router.get('/poll/:pollId', (req, res, next) => {
    const {pollId} = req.params;
    Conversation.findById(pollId)
    .populate('comments')
    .populate({
        path: 'comments',
        populate: {
          path: 'profile', 
          model: 'User',
        },
      })
    .then((comments) => res.render('/poll/:pollId', comments))
    .catch(err => next(err))
})

router.post('/poll/:pollId', (req, res, next) => {
    const {pollId} = req.params
    const {content} = req.body

    Comment.create({content, author: pollId})
    .then((message) => {
        return Vote.findByIdAndUpdate(commentId, {$push: {comments: comment._id}})
    })
    .then((chat) => res.redirect(`/poll/:pollId/${chat._id}`))
    .catch(err => next(err)) 
})


module.exports = router;