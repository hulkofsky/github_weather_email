const Bookshelf = require('../config/database')

const user = Bookshelf.Model.extend({
    tableName: 'users',
    comparePassword: function() {
        return this.hasMany('Invoice');
    }
})


module.exports = models = {
    user:  user
}