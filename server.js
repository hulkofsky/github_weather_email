const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const port = 3000
const cors = require('cors')
const constants = require('./config/constants')

//ROUTES
const authRouter = require('./routes/authRoutes')
const githubRouter = require('./routes/githubRoutes')

//morgan init
app.use(morgan('dev'))

app.use(cors())

//bodyparser init
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({limit: '50mb', extended: true}))

//using routes
app.use('/', authRouter)
app.use('/', githubRouter)

app.use(constants.LINK_FOR_STATIC_FILES, express.static('uploads'))

app.get('*', (req,res)=>{
    res.send('404. Page not found!')
})

app.listen(port, err=>{
    err?console.log('Oo oops! Something went wrong with http!'):
        console.log(`HTTP Server is running on ${port}`)
})