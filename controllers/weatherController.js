const _ = require('lodash')
const Helper = require('../shared/helpers')
const helper = new Helper
const WeatherService = require('../services/weatherService')
const weatherService = new WeatherService
const UserService = require('../services/userService')
const userService = new UserService

module.exports = class weatherController {
    async getWeather(req,res){    
        const token = req.headers.token
        const username = req.body.username
        const message = req.body.message
        const userId = req.params.userId        

        try {   
            const gitApiOptions = {
                host: process.env.GIT_API_HOST,
                path: `/users/${username}?client_id=${process.env.GIT_API_CLIENT_ID}&client_secret=${process.env.GIT_API_CLIENT_SECRET}`,
                headers: {"user-agent":process.env.API_HEADER}
            }
            
            await helper.validateParams({username: username, token: token, userId: userId})
            await userService.checkAuthorization(userId, token)
            
            const githubData = await weatherService.httpGetPromisified(gitApiOptions)
            
            const location = JSON.parse(githubData).location
            const email = JSON.parse(githubData).email

            const weatherApiOptions = {
                host: process.env.WEATHER_API_HOST,
                path: `/data/2.5/weather?q=${location}&APPID=${process.env.WEATHER_API_APPID}`,
                headers: process.env.API_HEADERS
            }

            await helper.validateParams({location, email})

            const weatherData = await weatherService.httpGetPromisified(weatherApiOptions)
            const checkedWeather = await weatherService.checkWeather(weatherData)

            const mailOptions = {
                from: process.env.NODEMAILER_FROM,
                to: email,
                subject: process.env.NODEMAILER_SUBJECT,
                html: `
                    ${message}. The weather in your region is ${checkedWeather.weather[0].main}. 
                    The tempreture is ${checkedWeather.main.temp}.
                    The pressure is ${checkedWeather.main.pressure}.
                    The humidity is ${checkedWeather.main.humidity}.
                    The wind speed is ${checkedWeather.wind.speed}.
                    Have a nice day! Jeesus loves You!
                `
            }
            const successMessage = await weatherService.sendEmail(mailOptions)

            res.status(200).json({
                successMessage
            })
        } catch (error) {
            if (!_.isEmpty(error)) {
                res.status(error.status).json(error)
            }
        }
    }
}