const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
        let token = jwt.sign(
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

router.post("/recover", async (req, res) => {
  const email = req.body.email;
  const persistedUser = await models.User.findOne({
    where: {
      email: email,
    },
  });
  if (persistedUser) {
    let token = jwt.sign({ userId: persistedUser.id }, process.env.TK_PASS, {
      expiresIn: "1h",
    });
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "gachasphere.dc@gmail.com", // generated ethereal user
        pass: process.env.SENDINBLUE_PW, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Gachasphere Support <DO_NOT_REPLY@gachasphere.com>', // sender address
      to: email, // list of receivers
      subject: "Password Reset Request", // Subject line
      text: "Please click on the link below to reset your password", // plain text body
      html: `<b>Please click on the link below to reset your password</b>
            <p><a href="http://localhost:3000/#/reset/${token}">${token}</a></p>
      `, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.json({
      passwordRest: true,
      message:
        "if this account is in our system, we emailed you a link to reset your password",
    });
  } else {
    res.json({
      passwordRest: false,
      message:
        "if this account is in our system, we emailed you a link to reset your password",
    });
  }
});
router.post("/reset/:token", async (req, res) => {
  let token = req.params.token;
  const decoded = jwt.verify(token, process.env.TK_PASS);
  const userId = decoded.userId;
  const password = req.body.password;
  bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
    if (error) {
      res.json({ resetPassword: false, message: "Cannot reset your password" });
    } else {
      await models.User.update(
        {
          password: hash,
        },
        {
          where: {
            id: userId,
          },
        }
      ).then((a) => {
        res.json({
          resetPassword: true,
          message: "Your password has been reset",
        });
      });
    }
  });
});

module.exports = router;
