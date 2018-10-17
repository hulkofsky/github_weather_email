
const express = require('express')
const router = express.Router()
const keys = require('../config/keys')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const models = require('../models/models')
const multer  = require('multer')
const storage = require('../config/multerStorage')
const upload = multer({
    storage: storage,
    limits: { fieldSize: 25 * 1024 * 1024 }
})
const constants = require('../config/constants')

router.post('/register', upload.fields([
    { name: 'email', maxCount: 1 },
    { name: 'password', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
    ]), (req,res)=>{
    const userData = req.body;

    //bcrypting password
    bcrypt.genSalt(10, (err,salt)=>{
        if (err){
            console.log(err, 'while crypting password(gensalt)')
        }
        bcrypt.hash(userData.password, salt, (err, hash)=>{
            if (err) {
                console.log(err, 'while crypting password')
            }else{
                models.user
                .where({email: userData.email})
                .fetch()
                .then(user=> {
                    if (user) {
                        return res.status(500).json({success: false, message: 'User with this email exists'})
                    } else {
                        jwt.sign({email: userData.email}, keys.secret, {expiresIn: 10000},(err, token)=>{
                        
                            let avatar_path = ''
                            
                            if(req.files.avatar) {
                                avatar_path = constants.FILE_PATH + req.files.avatar[0].filename
                            }

                            models.user
                            .forge({
                                email: userData.email,
                                password: hash,
                                avatar: avatar_path,
                                token: token
                            })
                            .save()
                            .then(result => {
                                return res.json({success: true, token: result.get('token'), avatar: result.get('avatar')})
                            })
                        })
                    }
                })
                .catch(err => {
                    console.log(err, 'error')
                    return res.status(500).json({success: false, data: {message: err.message}})
                })
            }
        })
    })
})

router.post('/login', (req,res)=> {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        res.status(500).json({success: false, message: 'Pls enter email and password to sign in'})
    } else {
        models.user
        .where({email: email})
        .fetch()
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.get('password'), (err, isMatch) => {
                    if (err) {
                        return res.json({success: false, massage: `An error has been occured while comparing passwords ${err}`})
                    }
                    if (isMatch) {
                        jwt.sign({email: user.get('email')}, keys.secret, {expiresIn: 10000},(err, token)=>{
                            models.user
                            .forge({email: email})
                            .fetch({require: true})
                            .then(user=> {
                                user
                                .save({token: `JWT ${token}`})
                                .then(user=>{
                                    res.status(200).json({
                                        success: true,
                                        user: user,
                                    })
                                }).catch(err=>{
                                    console.log(`Error while saving Investors token in DB - ${err}`)
                                })
                            })
                        })
                    } else {
                        res.status(404).json({success: false, message: 'Authentication failed.'})
                    }
                })
            } else {
                res.status(404).json({success: false, message: 'User not found!'})
            }
        })
    }
})

module.exports = router