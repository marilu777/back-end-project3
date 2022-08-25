const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

router.get("/verify", isAuthenticaded, (req, res) => {
  console.log("the token: (or not)",req.payload)
  res.status(200).json(req.payload);
})

router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your email." });
  }

  if (password.length < 7) {
    return res
      .status(400)
      .json({ errorMessage: "Your password needs to be at least 7 characters long." });
  }

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
        return User.create({
          email,
          password: hashedPassword,
        });
      })
      .then((user) => {
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
  });
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

    router.put('/user/:userId', (req, res, next) => {
      const {userId} = req.params;
      const {username, email, contact} = req.body;

      User.findByIdAndUpdate(userId, {username, email, contact}, {new: true})
      .then((user) => res.status(201).json(user))
      .catch((err) => res.json(err));
      });

    router.delete('/user/:Id', (req, res, next) => {
      const {userId} = req.params;
      User.findByIdAndRemove(userId)
      .then((user) => res.status(200).json())
      .catch((err) => res.json(err));
});

});



module.exports = router;
