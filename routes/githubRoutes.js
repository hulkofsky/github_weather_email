const express = require('express')
const router = express.Router()
const models = require('../models/models')
const https = require('https')
const nodemailer = require('nodemailer')
const keys = require('../config/keys')

router.post('/:userId/getweather', (req,res)=> {
    const token = req.headers.token
    const username = req.body.username
    const message = req.body.message
    const userId = req.params.userId

    if(!token){
        res.status(403).json({success: false, message: 'Unauthorized'})
    }else{
        models.user
        .query((qb) => {
            qb
            .where({id: userId})
            .andWhere({token: token}) //token check here
        })
        .fetch()
        .then(user => {
            if (user) {
                //get user emails
                const gitApiOptions = {
                    host: 'api.github.com',
                    path: `/users/${username}?client_id=d53179822ebe336820e2&client_secret=69357e00315b92713579cb8906216c02d7cf05b9`,
                    headers: {'user-agent': 'node.js'}
                }
                
                new Promise((resolve, reject)=>{
                    const gitApiReq = https.get(gitApiOptions, (gitRes) =>{
                        // Buffer the body entirely for processing as a whole.
                        const bodyChunks = []
                        gitRes.on('data', (chunk) => {
                            // You can process streamed parts here...
                            bodyChunks.push(chunk)
                        }).on('end', () => {
                            const body = Buffer.concat(bodyChunks);
                            // ...and/or process the entire body here.
    
                            //get user location
                            let location = JSON.parse(body).location
                            let email = JSON.parse(body).email
    
                            try{
                                location = JSON.parse(body).location
                                email = JSON.parse(body).email
                            }catch(err){
                                console.log(err, `error while parsing weather json ${err}`)
                                reject({success: false, status: '500', message: `error while parsing github json ${err}`})
                            }
    
                            if(!location){
                                reject({success: false, status: '500', message: `location is not specified.`})
                            }
                            if(!email){
                                reject({success: false, status: '500', message: `email is not public. sorry`})
                            }
    
                            //get weather for location
                            const weatherApiOptions = {
                                host: 'api.openweathermap.org',
                                path: `/data/2.5/weather?q=${location}&APPID=b44cd28aaec81a2c23ff915c59b3640c`,
                                headers: {'user-agent': 'node.js'}
                            }
                                
                            const weatherApiReq = https.get(weatherApiOptions, (weatherRes) =>{
                                // Buffer the body entirely for processing as a whole.
                                const bodyChunks = []
                                weatherRes.on('data', (chunk) => {
                                    // You can process streamed parts here...
                                    bodyChunks.push(chunk)
                                }).on('end', () => {
                                    const body = Buffer.concat(bodyChunks)
    
                                    //send email with message and weather
                                    nodemailer.createTestAccount((err) => {
                                        if (err){
                                            reject({success: false, status: '500', message: `Internal server error.`})
                                        }
    
                                        let transporter = nodemailer.createTransport({
                                            service: keys.nodemailer.service,
                                            auth: {
                                                user: keys.nodemailer.auth.user,
                                                pass: keys.nodemailer.auth.pass
                                            }
                                        })
    
                                        let weather = null
                                        try{
                                            weather = JSON.parse(body)       
                                        }catch(err){
                                            console.log(err, `error while parsing weather json ${err}`)
                                            reject({success: false, status: '500', message: `error while parsing weather json ${err}`})
                                        }
                                        
                                        if(weather.cod !== 200){
                                            reject({success: false, status: '500', message: `Location not found`})
                                        }

                                        const mailOptions = {
                                            from: keys.nodemailer.from,
                                            to: email,//keys.nodemailer.to, //place EMAIL parameter here
                                            subject: keys.nodemailer.subject,
                                            html: `
                                                ${message}. The weather in your region is ${weather.weather[0].main}. 
                                                The tempreture is ${weather.main.temp}.
                                                The pressure is ${weather.main.pressure}.
                                                The humidity is ${weather.main.humidity}.
                                                The wind speed is ${weather.wind.speed}.
                                                Have a nice day! Jeesus loves You!
                                            `
                                        }
                                
                                        transporter.sendMail(mailOptions, (error, info) => {
                                            if (error) {
                                                reject({success: false, status: '500', message: `error while sending email - ${error}`})
                                                console.log({success: false, message: `error while sending email - ${error}`})
                                            }else{
                                                resolve({success: true, status: '200', message: `Email successfully sent to ${email}`})
                                                console.log({success: true, message: `Email sent to ${email}`})                                       
                                            }
                                        })          
                                        
                                        // setup email data with unicode symbols
                                        
                                    })     
                                })
                            })
                            weatherApiReq.on('error', (error) => {
                                console.log('GITHUB API ERROR: ' + error)
                                reject({success: false, status: '500', message: `Weather API error. ${error}`})
                            })
                            
                        })
                        gitApiReq.on('error', (error) => {
                            console.log('GITHUB API ERROR: ' + error)
                            reject({success: false, status: '500', message: `GITHUB API error. ${error}`})
                        })
                    })
                }).then((data)=>{
                    console.log(data, ' ebanii status')
                    return res.status(Number(data.status)).json(data)
                }) 
            }else{
                return res.status(403).json({success: false, data: {message: `Unauthorized`}}) 
            }
        })
    }
})

module.exports = router