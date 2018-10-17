const keys = {
    postgres: {
        client: 'pg',
        host: '127.0.0.1',
        port: 5432,
        user: 'cubex',
        password: 'cubex',
        database: 'backend_test',
        charset: 'utf8'
    },
    secret: '456789-735459-165756-478266',
    nodemailer: {
        service: 'gmail',
        auth: {
            user: 'perkosrakkukutsaplevich@gmail.com',
            pass: 'perkosrak9379992',
        },

        from: '"Weather" <perkosrakkukutsaplevich@gmail.com>',
        to: 'anton.holkovsky@qbex.io',
        subject: 'Weather',
        html: `Weather in your region`,
    }
}

module.exports = keys