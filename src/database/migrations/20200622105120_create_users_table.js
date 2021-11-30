exports.up = function(knex, Promise) {
return knex.schema.createTable('user', function(table) {
  table.increments('user_id');
  table.integer('role_id');
  table.string('email').notNullable();
  table.string('password').notNullable();
  table.string('name').notNullable();
  table.string('phone').notNullable();
  table.string('registered_by');
  table.string('social_network');
  table.string('link_social_network');
  table.string('image');
  table.boolean('activated').notNullable();
  table.string('token');
  table.timestamp('created_at').defaultTo(knex.fn.now())
  table.timestamp('updated_at').defaultTo(knex.fn.now())
})
};
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
  }

  

// return knex.schema.createTable('user', function(table) {
//   table.increments('user_id');
//   table.integer('role_id');
//   table.string('email').notNullable();
//   table.string('password').notNullable();
//   table.string('name').notNullable();
//   table.string('phone').notNullable();
//   table.string('registered_by');
//   table.string('social_network');
//   table.string('link_social_network');
//   table.string('image');
//   table.boolean('activated').notNullable();
//   table.string('token');
//   table.timestamp('created_at').defaultTo(knex.fn.now())
//   table.timestamp('updated_at').defaultTo(knex.fn.now())
// })