const https = require('https')
const nodemailer = require('nodemailer')
const nodemailerOptions = require('../config/nodemailer')

module.exports = class WeatherService{
    httpGetPromisified(options){
        return new Promise((resolve,reject)=>{
            https.get(options, (res) =>{
                const bodyChunks = []

                res
                .on('data', (chunk) => {
                    bodyChunks.push(chunk)
                })
                .on('end', () => {
                    resolve(Buffer.concat(bodyChunks).toString())
                })
                .on('error', (error) => {
                    reject({success: false, status: res.statusCod, errors: [error]})
                })
            })
        })  
    }
  
    sendEmail(mailOptions){
        return new Promise((resolve,reject)=>{
            nodemailer
            .createTransport(nodemailerOptions)
            .sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject({success: false, status: 500, errors: [`error while sending email - ${error}`]})
                }else{
                    resolve({success: true, message: `Email successfully sent to ${mailOptions.to}`})                                   
                }
            })       
        })
    }

    checkWeather(data){
        return new Promise((resolve, reject)=>{
            const weather = JSON.parse(data)   
            if(weather.cod && (Number(weather.cod) !== 200)){
                reject({success: false, status: 500, message: `Location not found`})
            }else{
                resolve(weather)
            }
        })
    }
}