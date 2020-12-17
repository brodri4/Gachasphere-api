const express = require('express')
const router = express.Router()
const models = require('../models')


router.post('/:id/create-rating', (req,res) => {
    const userId = req.params.id
    const gameId = req.body.gameId
    const gameplayRating = req.body.gameplayRating
    const f2pRating = req.body.f2pRating
    const playing = req.body.playing

    let persistedUserGame = models.UserGame.findOne({
        where: {
            UserId: userId,
            GameId: gameId}
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
    })
    }else{
        res.send('Rating already created')
    }

})

router.get('/:id', (req,res) => {
    const userId = req.params.id
    models.UserGame.findAll({
        where: { UserId: userId }, include:[
            models.Game
        ]
    }).then((list) => {
        res.send(list)
    })

})


module.exports = router