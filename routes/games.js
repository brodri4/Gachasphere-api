const express = require('express')
const router = express.Router()
const models = require('../models')

router.post('/create-game', (req, res) => {
    const title = req.body.title
    const date = req.body.date
    const dev = req.body.dev
    const logo = req.body.logo

    let game = models.Game.build({
        title: title,
        releaseDate: date,
        developer: dev,
        logo: logo
    })
    game.save().then(() => {
        res.send('login')
    })
})

module.exports = router