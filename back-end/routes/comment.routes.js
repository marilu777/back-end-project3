const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Vote = require("../models/Vote.model");
const Comment = require("../models/Comment.model");


router.post("/comment/create/:otherUserId", async (req, res, next) => {
    const {author, content} = req.body;

    if (!req.body.author && !req.body.description) {
        res.status(400).send({ message: "Content can not be empty!" });
    }

    const comment = new CommentModel({
        author: req.body.userName,
        content: req.body.content,
    });

    await comment.save().then(data => {
        res.send({
            message:"Comment created successfully!!",
            comment:data
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating comment"
        });
    });
});

router.get ("/pollResult/:id", async (req, res) => {
    try {
        const comment = await CommentModel.findById(req.params.id);
        res.status(200).json(comment);
    } catch(error) {
        res.status(404).json({ message: error.message});
    }
});

router.patch ("/pollResult/:id", async (req, res) => {
    if(!req.body) {
        res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    
    const id = req.params.id;
    
    await CommentModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({
                message: `Comment not found.`
            });
        }else{
            res.send({ message: "Comment updated successfully." })
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
});

router.delete ("/pollResult/delete/:id", async (req, res) => {
    await CommentModel.findByIdAndRemove(req.params.id).then(data => {
        if (!data) {
          res.status(404).send({
            message: `Comment not found.`
          });
        } else {
          res.send({
            message: "Comment deleted successfully!"
          });
        }
    }).catch(err => {
        res.status(500).send({
          message: err.message
        });
    });
});



/* 
    try {
       const {otherUserId} = req.params
       const user = req.payload._id 

       let checkPollDetail = await Comment.findOne({ resultPoll: {$all: [votePollId, id]}});

       if (checkPollDetail === null) {
        let createdComment = await Comment.create({ resultPoll: [votePollId, id] })
        await User.findByIdAndUpdate(votePollId, { $push: { resultPoll: createdComment._id } })
        await User.findByIdAndUpdate(id, { $push: { resultPoll: createdComment._id } })
  
        res.status(200).json(createdComment)
      }

    } catch (error) {
        res.status(400).json({ errorMessage: "Error creating conversation" })
    }
    
    

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
 */

module.exports = router;