
exports.up = function(knex) {
    return knex.schema.createTable('product', function(table) {
        table.increments('product_id');
        table.integer('store_id').notNullable();
        table.integer('category_id');
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('price').notNullable();
        table.string('image');
        table.integer('reviews').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('product');
};
