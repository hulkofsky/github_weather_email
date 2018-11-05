
const express = require('express')
const router = express.Router()
const multer  = require('multer')
const storage = require('../config/multerStorage')
const upload = multer({
    storage: storage,
    limits: { fieldSize: 25 * 1024 * 1024 }
})
const AuthController = require('../controllers/authControler')
const authController = new AuthController

router.post(
    '/register', 
    upload.fields([
        { name: 'email', maxCount: 1 },
        { name: 'password', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
    ]), 
    (req,res)=>{
        authController.register(req,res)
})

router.post('/login', (req,res)=>{
    authController.login(req,res)
})

module.exports = router