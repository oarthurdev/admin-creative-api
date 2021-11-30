
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('category').del()
    .then(function () {
      // Inserts seed entries
      return knex('category').insert([
        {name: 'Carvão'},
        {name: 'Essência'},
        {name: 'Alumínio'},
        {name: 'Rosh'},
        {name: 'Prato'},
        {name: 'Stem'},
        {name: 'Vaso'},
        {name: 'Narguile montada'},
        {name: 'Acendedor de carvão'},
        {name: 'Panela'},
        {name: 'Seda'},
        {name: 'Bong'},
        {name: 'Pipe'},
        {name: 'Dichavador'},
        {name: 'Isqueiro'},
        {name: 'Maçarico'}
      ]);
    });
};
