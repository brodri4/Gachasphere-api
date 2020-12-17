require("dotenv").config();

const express = require("express");
const app = express();
const models = require("./models");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

const SALT_ROUNDS = 10;

app.post("/login", async (req, res) => {
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
        res.json({login: true, token: token });
      } else {
        res.json({ login: false, message: "Invalid username or password" });
      }
    });
  } else {
    res.json({ login: false, message: "Invalid username or password" });
  }
});

app.post("/register", async (req, res) => {
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

//This is for testing only

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.listen(8080, () => {
  console.log("Server is Running");
});
