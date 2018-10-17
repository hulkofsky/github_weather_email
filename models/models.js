const Bookshelf = require('../config/database')

const user = Bookshelf.Model.extend({tableName: 'users'})

module.exports = models = {
    user:  user
}