
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          email: `avatar@gmail.com`,
          password: `$2a$10$hprTrv4bIKpwXjcB1B3rPO3opsTQdOO2UOL2DeG8qZX2uvwHKe12i`,
          avatar: `https://www.google.com.ua`
        },
      ]);
    });
};