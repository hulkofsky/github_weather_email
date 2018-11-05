const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

//ROUTES
const authRouter = require('./routes/authRoutes')
const githubRouter = require('./routes/weatherRoutes')

//morgan init
app.use(morgan('dev'))

app.use(cors())

//bodyparser init
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({limit: '50mb', extended: true}))

//using routes
app.use('/', authRouter)
app.use('/', githubRouter)

app.use(process.env.LINK_FOR_STATIC_FILES, express.static('uploads'))

app.get('*', (req,res)=>{
    res.send('404. Page not found!')
})

app.listen(process.env.PORT, err=>{
    err?console.log('Oo oops! Something went wrong with http!'):
        console.log(`HTTP Server is running on ${process.env.PORT}`)
})