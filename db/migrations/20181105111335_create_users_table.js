exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
      table.increments()
      table.string('email').notNullable()
      table.string('password').notNullable()
      table.string('avatar').notNullable()
      table.string('token')
  })
}

exports.down = function(knex, Promise) {
  knex.schema.dropTable('users')
}
