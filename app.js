require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/users");
const gamesRouter = require('./routes/games');
const adminRouter = require('./routes/admin');
const PORT = process.env.PORT || 8080

app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);
app.use('/games', gamesRouter)
app.use('/admin', adminRouter)


app.get("/hello", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log("Server is Running");
});
