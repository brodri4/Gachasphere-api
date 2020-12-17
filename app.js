require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/users");
const gamesRouter = require('./routes/games');
const adminRouter = require('./routes/admin');

app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);
app.use('/games', gamesRouter)
app.use('/admin', adminRouter)


app.get("/hello", (req, res) => {
  res.send("hello");
});

app.listen(8080, () => {
  console.log("Server is Running");
});
