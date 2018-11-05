const bcrypt = require('bcrypt')
const _ = require('lodash')
const Helper = require('../shared/helpers')
const helper = new Helper
const UserService = require('../services/userService')
const userService = new UserService

module.exports = class AuthRoutes {
    login(req,res){
        const params = req.body
        
        helper
        .validateParams(params)
        .then(()=>{
           return userService.getUserByEmail(params.email)
        })
        .then(user=>{
            return helper.comparePassword(params.password, user.get('password'))
        })
        .then(()=>{
            return helper.createToken(params.email)
        })
        .then(token=>{
            const data = {
                token: `JWT ${token}`
            }
            return userService.updateUser(params.email, data)
        })
        .then(user=>{
            res.status(200).json({
                success: true,
                user: user,
            })
        })    
        .catch(error=>{
            if (!_.isEmpty(error)) {
                res.status(error.status).json(error)
            }
        })   
    }

    register(req,res){
        const userData = req.body;
        let password = ''
        
        helper
        .validateParams(userData)
        .then(()=>{
            return userService.checkUserEmail(userData.email)
        })  
        .then(()=>{
            return bcrypt.hash(userData.password, 10)
        })    
        .then(hash=> {
            password = hash
            return helper.createToken(userData.email)
        })
        .then(token=>{
            const data = {
                email: userData.email,
                password: password,
                avatar: process.env.FILE_PATH + req.files.avatar[0].filename,
                token: `JWT ${token}`
            }
            return userService.createUser(data)
        })
        .then(user=>{
            res.status(200).json({
                success: true,
                user: user,
            })
        })
        .catch(error=>{
            if (!_.isEmpty(error)) {
                res.status(error.status).json(error)
            }
        })   
    }
}