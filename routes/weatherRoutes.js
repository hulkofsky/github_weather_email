const express = require('express')
const router = express.Router()
const WeatherController = require('../controllers/weatherController')
const weatherController = new WeatherController

router.post('/:userId/getweather', (req,res)=> {
    weatherController.getWeather(req,res)
})

module.exports = router