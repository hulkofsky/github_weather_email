const bcrypt = require('bcrypt')
const _ = require('lodash')
const Helper = require('../shared/helpers')
const helper = new Helper
const UserService = require('../services/userService')
const userService = new UserService

module.exports = class AuthRoutes {
    async login(req,res){
        const params = {
            email: req.body.email,
            password: req.body.password,
        }

        try {   
            await helper.validateParams(params)
            const user = await userService.getUserByEmail(params.email)
            await helper.comparePassword(params.password, user.get('password'))
            const token = await helper.createToken(params.email)
            await userService.updateUser(params.email, {token: `JWT ${token}`})

            res.status(200).json({
                success: true,
                user: user,
            })
        } catch (error) {
            if (!_.isEmpty(error)) {
                res.status(error.status).json(error)
            }
        }
    }

    async register(req,res){
        const userData = {
            email: req.body.email,
            password: req.body.password,
            avatar: req.files.avatar
        }
        
        try {   
            await helper.validateParams(userData)
            await userService.checkUserEmail(userData.email)
            const password = await bcrypt.hash(userData.password, 10)
            const token = await helper.createToken(userData.email)

            const data = {
                email: userData.email,
                password: password,
                avatar: process.env.FILE_PATH + req.files.avatar[0].filename,
                token: `JWT ${token}`
            }

            const newUSer = await userService.createUser(data)

            res.status(200).json({
                success: true,
                user: newUSer,
            })
        } catch (error) {
            if (!_.isEmpty(error)) {
                res.status(error.status).json(error)
            }
        }
    }
}