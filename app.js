require("dotenv").config();

const express = require("express");
const app = express();
// const models = require("./models");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const userRoutes = require("./routes/users");

app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.listen(8080, () => {
  console.log("Server is Running");
});
