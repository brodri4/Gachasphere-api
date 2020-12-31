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
        res.json({
          userAdded: false,
          message: "Something went wrong - user not created.",
        });
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
      expiresIn: "15m",
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
      subject: "Gachasphere Password Reset Request", // Subject line
      text: "Click the link below to reset your password.", // plain text body
      html: `<div style="width:100%!important;margin:0;padding:0">
              <center>
                <table style="border-spacing:0;border-collapse:collapse;font-family:proxima-nova,'helvetica neue',helvetica,arial,geneva,sans-serif;width:100%!important;height:100%!important;color:#4c4c4c;font-size:15px;line-height:150%;background:#ffffff;margin:0;padding:0;border:0">
                  <tbody>
                    <tr style = "vertical-align:top;padding:0">
                      <td align="center" valig="top" style = "vertical-align:top;padding:0">
                        <table style="border-spacing:0;border-collapse:collapse;font-family:proxima-nova,'helvetica neue',helvetica,arial,geneva,sans-serif;width:600px;color:#4c4c4c;font-size:15px;line-height:150%;background:#ffffff;margin:40px 0;padding:0;border:0">
                          <tbody>
                            <tr style="vertical-align:top;padding:0">
                              <td align="center" valign="top" style="style="vertical-align:top;padding:0 40px">
                                <table style="border-spacing:0;border-collapse:collapse;font-family:proxima-nova,'helvetica neue',helvetica,arial,geneva,sans-serif;width:100%;background:#ffffff;margin:0;padding:0;border:0">
                                  <tbody>
                                    <tr style="vertical-align:top;padding:0">
                                      <td style="vertical-align:top;text-align:left;padding:0" align="left" valign="top">
                                        <h1>
                                          <img src="https://i.postimg.cc/Y9hdHJNH/Gachasphere-Red.png" width="120" height="65" />
                                        </h1>
                                        <p style="margin:20px 0">Someone (hopefully you) has requested a password reset for your Gachasphere account. Click the link below to set a new password:</p>
                                        <p style="margin:20px 0"><a href="http://localhost:3000/#/reset/${token}">${token}</a></p>
                                        <p style="margin:20px 0">If you don't wish to reset your password, disregard this email and no action will be taken.</p>
                                        <p style="margin:20px 0">Gachasphere Team<br><a href="#" style="color:#6e5baa">Gachasphere....(Website URL)</a></p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </center>
            </div>
      `, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.json({
      passwordRest: true,
      message: "A password reset email is on its way.",
    });
  } else {
    res.json({
      passwordRest: false,
      message: "This email is not in our system.",
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
      res.json({
        resetPassword: false,
        message: "Something went wrong - your password was not updated.",
      });
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
          message: "Your password has been updated.",
        });
      });
    }
  });
});

module.exports = router;
