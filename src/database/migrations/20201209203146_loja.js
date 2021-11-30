
exports.up = function(knex) {
    return knex.schema.createTable('store', function(table) {
        table.increments('store_id');
        table.integer('user_id').notNullable();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('zipcode').notNullable();
        table.string('street').notNullable();
        table.string('number');
        table.string('complement');
        table.string('neighborhood').notNullable();
        table.string('city').notNullable();
        table.string('state').notNullable();
        table.string('phone').notNullable();
        table.string('product');
        table.string('image');
        table.integer('reviews').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('store');
};
