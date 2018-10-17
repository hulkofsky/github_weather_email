const {Client} = require('pg')
const keys = require('./keys')
const Bookshelf = require('./database')
const users = require('./tables/users')

const models = require('../models/models')

//connecting to postgres
const postgresClient = new Client({
    host: keys.postgres.host,
    port: keys.postgres.port,
    user: keys.postgres.user,
    password: keys.postgres.password,
    database: keys.postgres.database
})

postgresClient.connect((err)=>{
    err ? console.log(`Postgres connection error: ${err}`) :
        console.log('Postgres connected!')
})

//table project_statuses
users.forEach((item, i)=>{
    models.user
    .forge({
        email: item.email,
        password: item.password,
        avatar: item.avatar
    })
    .save()
    .then(project_status=>{
        console.log(`project_status ${i} successfully inserted`)
    })
    .catch(err=>{
        console.log(`Error while inserting project_status ${i} - ${err}`)
    })
})







