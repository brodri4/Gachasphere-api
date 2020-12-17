require("dotenv").config();

const express = require("express");
const app = express();
const models = require("./models");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const persistedUser = await models.User.findOne({
    where: {
      username: username,
      password: password,
    },
  });
  if (persistedUser) {
    var token = jwt.sign(
      { username: username, userId: persistedUser.id },
      process.env.TK_PASS
    );
    res.json({ token: token });
  } else {
    res.json({ message: "Invalid username or password" });
  }
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const user = models.User.build({
    username: username,
    password: password,
    email: email,
  });
  user.save().then((result) => res.json({ success: true }));
});

//This is for testing only

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.listen(8080, () => {
  console.log("Server is Running");
});
