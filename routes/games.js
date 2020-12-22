const express = require("express");
const router = express.Router();
const models = require("../models");
const jwt = require("jsonwebtoken");
const authentication = require("../authMiddleware");

router.get('/', (req, res) => {
  models.Game.findAll({
    order: [['title', 'ASC']]
  })
  .then((result) => {
    res.json(result)
  }).catch((error) => {
    res.json({ message: error });
  })
})

router.post("/create-rating", authentication, async (req, res) => {
  const userId = res.locals.user.userId;

  const gameId = req.body.gameId;
  const gameplayRating = req.body.gameplayRating;
  const f2pRating = req.body.f2pRating;
  const playing = req.body.playing;

  let persistedUserGame = await models.UserGame.findOne({
    where: {
      UserId: userId,
      GameId: gameId,
    },
  }).catch((error) => {
    res.json({ message: error });
  });

  if (!persistedUserGame) {
    let UserGame = models.UserGame.build({
      GameId: gameId,
      UserId: userId,
      gameplayRating: gameplayRating,
      f2pRating: f2pRating,
      playing: playing,
    });
    UserGame.save()
      .then(async () => {
        await updateRating(gameId);
      res.send({ratingCreated: true});
      })
      .catch((error) => {
        res.json({ message: error });
      });
  } else {
    res.send({ratingCreated: false, message: "Rating already created"});
  }
});

router.post("/update-rating/:ratingId", authentication, (req, res) => {
  const userId = res.locals.user.userId;

  const ratingId = req.params.ratingId;
  const gameId = req.body.gameId;
  const gameplayRating = req.body.gameplayRating;
  const f2pRating = req.body.f2pRating;
  const playing = req.body.playing;

  models.UserGame.update(
    {
      GameId: gameId,
      UserId: userId,
      gameplayRating: gameplayRating,
      f2pRating: f2pRating,
      playing: playing,
    },
    { where: { id: ratingId } }
  )
    .then(async (rating) => {
      await updateRating(gameId);
      res.send("Rating Successfully Updated");
    })
    .catch((error) => {
      res.json({ message: error });
    });
});

router.get("/my-ratings", authentication, (req, res) => {
  // let headers = req.headers["authorization"];
  // const token = headers.split(" ")[1];
  // const decoded = jwt.verify(token, process.env.TK_PASS);
  // let userId = decoded.userId;
  const userId = res.locals.user.userId;

  models.UserGame.findAll({
    where: { UserId: userId },
    include: [models.Game],
  })
    .then((list) => {
      res.send(list);
    })
    .catch((error) => {
      res.json({ message: error });
    });
});

//function section
const calRating = async (gameID) => {
  let gameRating = await models.UserGame.findAll({
    where: { GameId: gameID },
  });
  const userGame = gameRating.map((usergame) => {
    return parseFloat(usergame.gameplayRating);
  });
  totalRating = userGame.reduce((accumulator, userGame) => {
    return accumulator + userGame;
  });
  averageRating = totalRating / userGame.length;
  return averageRating;
};
const calF2PRating = async (gameID) => {
  let gameRating = await models.UserGame.findAll({
    where: { GameId: gameID },
  });
  const userGame = gameRating.map((usergame) => {
    return parseFloat(usergame.f2pRating);
  });
  totalRating = userGame.reduce((accumulator, userGame) => {
    return accumulator + userGame;
  });
  averageRating = totalRating / userGame.length;
  return averageRating;
};

const updateRating = async (gameId) => {
  let averageRating = await calRating(gameId);
  let averageF2P = await calF2PRating(gameId);
  let numberOfPlayer = await calCurrentPlayer(gameId);
  calCurrentPlayer(gameId);
  await models.Game.update(
    {
      averageRating: averageRating,
      averageF2P: averageF2P,
      numberOfPlayer: numberOfPlayer,
    },
    {
      where: {
        id: gameId,
      },
    }
  );
};

const calCurrentPlayer = async (gameId) => {
  let currentPlayerNumber = await models.UserGame.count({
    where: { GameId: gameId, playing: "TRUE" },
  });
  return currentPlayerNumber;
};

module.exports = router;
