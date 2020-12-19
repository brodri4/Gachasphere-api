const express = require('express');
const router = express.Router();
const models = require('../models');
const jwt = require("jsonwebtoken");


router.post('/create-rating', (req,res) => {
    let headers = req.headers['authorization'];
    const token = headers.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TK_PASS);
    let userId = decoded.userId;

    const gameId = req.body.gameId
    const gameplayRating = req.body.gameplayRating
    const f2pRating = req.body.f2pRating
    const playing = req.body.playing

    let persistedUserGame = models.UserGame.findOne({
        where: {
            UserId: userId,
            GameId: gameId}
    }).catch((error) => {
        res.json({message: error})
    })

    if(!persistedUserGame){
    let UserGame = models.UserGame.build({
        GameId:gameId,
        UserId:userId,
        gameplayRating: gameplayRating,
        f2pRating: f2pRating,
        playing: playing
    })
    UserGame.save().then(()=>{
        res.send('Rating Saved')
    }).catch((error) => {
        res.json({message: error})
    })
    }else{
        res.send('Rating already created')
    }
})

router.post('/update-rating/:ratingId', (req,res) => {
    let headers = req.headers['authorization'];
    const token = headers.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TK_PASS);
    let userId = decoded.userId;
    
    const ratingId = req.params.ratingId
    const gameId = req.body.gameId
    const gameplayRating = req.body.gameplayRating
    const f2pRating = req.body.f2pRating
    const playing = req.body.playing

    models.UserGame.update(
        {
            GameId:gameId,
            UserId:userId,
            gameplayRating: gameplayRating,
            f2pRating: f2pRating,
            playing: playing
        },
        {where: {id: ratingId}
    }).then((rating) => {
        res.send('Rating Successfully Updated')
    }).catch((error) => {
        res.json({message: error})
    }) 
})

router.get('/my-ratings', (req,res) => {
    let headers = req.headers['authorization'];
    const token = headers.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TK_PASS);
    let userId = decoded.userId;
    
    models.UserGame.findAll({
        where: { UserId: userId }, include:[
            models.Game
        ]
    }).then((list) => {
        res.send(list)
    }).catch((error) => {
        res.json({message: error})
    })

})


module.exports = router