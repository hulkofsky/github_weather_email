module.exports = {
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
    },

    from:`${process.env.NODEMAILER_FROM_ALIAS} <${process.env.NODEMAILER_FROM_EMAIL}>`,
    to: process.env.NODEMAILER_TO,
    subject: process.env.NODEMAILER_SUBJECT,
    html: process.env.NODEMAILER_HTML,
}

