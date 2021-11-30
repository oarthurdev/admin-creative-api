
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('role').del()
    .then(function () {
      // Inserts seed entries
      return knex('role').insert([
        {role_id: 1, name: 'Developer'},
        {role_id: 2, name: 'Administrator'},
        {role_id: 3, name: 'Usuário'}
      ]);
    });
};
