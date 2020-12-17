const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const persistedUser = await models.User.findOne({
    where: {
      username: username,
    },
  });
  if (persistedUser) {
    bcrypt.compare(password, persistedUser.password, (error, result) => {
      if (result) {
        var token = jwt.sign(
          { username: username, userId: persistedUser.id },
          process.env.TK_PASS
        );
        res.json({ login: true, token: token });
      } else {
        res.json({ login: false, message: "Invalid username or password" });
      }
    });
  } else {
    res.json({ login: false, message: "Invalid username or password" });
  }
});

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const persistedUser = await models.User.findOne({
    where: {
      username: username,
    },
  });
  if (!persistedUser) {
    bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
      if (error) {
        res.json({ userAdded: false, message: "Cannot create user!" });
      } else {
        const user = await models.User.build({
          username: username,
          password: hash,
          email: email,
        });
        user.save().then((result) => res.json({ userAdded: true }));
      }
    });
  } else {
    res.json({ userAdded: false, message: "User already exists!" });
  }
});

module.exports = router;
