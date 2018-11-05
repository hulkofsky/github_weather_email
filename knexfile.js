require('dotenv').config()

module.exports = {
    development: {
        client: process.env.DB_CLIENT,
        connection: {
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER,
            password : process.env.DB_PASSWORD,
            database : process.env.DB_NAME,
            charset  : process.env.DB_CHARSET
        },
        migrations:{
           directory: __dirname + process.env.DB_MIGRATIONS,
       },
       seeds: {
           directory: __dirname + process.env.DB_SEEDS
       },
    },
    production: {
        migrations:{
            directory: __dirname + process.env.DB_MIGRATIONS,
        },
        seeds: {
            directory: __dirname + process.env.DB_MIGRATIONS
        },
    }
}