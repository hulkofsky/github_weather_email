const _ = require('lodash')
const Helper = require('../shared/helpers')
const helper = new Helper
const WeatherService = require('../services/weatherService')
const weatherService = new WeatherService
const UserService = require('../services/userService')
const userService = new UserService

module.exports = class weatherController {
    getWeather(req,res){    
        const token = req.headers.token
        const username = req.body.username
        const message = req.body.message
        const userId = req.params.userId
        
        let location
        let email
        helper
        .validateParams({username: username, token: token, userId: userId})
        .then(()=>{
            return userService.checkAuthorization(userId, token)
        })
        .then(user=>{
            const options = {
                host: process.env.GIT_API_HOST,
                path: `/users/${username}?client_id=${process.env.GIT_API_CLIENT_ID}&client_secret=${process.env.GIT_API_CLIENT_SECRET}`,
                headers: {"user-agent":process.env.API_HEADER}
            }
            return weatherService.httpGetPromisified(options)
        })
        .then(data=>{
            location = JSON.parse(data).location
            email = JSON.parse(data).email
            return helper.validateParams({location, email})
        })
        .then(()=>{
            const options = {
                host: process.env.WEATHER_API_HOST,
                path: `/data/2.5/weather?q=${location}&APPID=${process.env.WEATHER_API_APPID}`,
                headers: process.env.API_HEADERS
            }
            return weatherService.httpGetPromisified(options)
        })
        .then(data=>{
            return weatherService.checkWeather(data)
        })
        .then(weather=>{
            const mailOptions = {
                from: process.env.NODEMAILER_FROM,
                to: email,
                subject: process.env.NODEMAILER_SUBJECT,
                html: `
                    ${message}. The weather in your region is ${weather.weather[0].main}. 
                    The tempreture is ${weather.main.temp}.
                    The pressure is ${weather.main.pressure}.
                    The humidity is ${weather.main.humidity}.
                    The wind speed is ${weather.wind.speed}.
                    Have a nice day! Jeesus loves You!
                `
            }
            return weatherService.sendEmail(mailOptions)
        })
        .then(message=>{
            res.status(200).json({
                message
            })
        })
        .catch(error=>{
            if (!_.isEmpty(error)) {
                res.status(error.status).json(error)
            }
        })   
    }
}