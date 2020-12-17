const jwt = require("jsonwebtoken");
const models = require("./models");
require("dotenv").config();

async function authentication(req, res, next) {
  const headers = req.headers["authorization"];
  const token = headers;
  if (token) {
    const decoded = jwt.verify(headers, process.env.TK_PASS);
    if (decode) {
      const username = decoded.username;
      const userId = decoded.userId;
      const persistedUser = await models.User.findOne({
        where: {
          username: username,
        },
      });
      if (persistedUser) {
        res.locals.userId = userId;
        next();
      } else {
        res.json({ message: "You're not authorized!" });
      }
    } else {
      res.json({ message: "You're not authorized!" });
    }
  } else {
    res.json({ message: "You're not authorized!" });
  }
}

module.exports = authentication;
