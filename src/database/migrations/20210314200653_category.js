
exports.up = function(knex) {
    return knex.schema.createTable('category', function(table) {
        table.string('name')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('category');
};
