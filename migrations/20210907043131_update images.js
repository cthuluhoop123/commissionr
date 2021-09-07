exports.up = function (knex) {
    return knex.schema
        .createTable('update_images', function (table) {
            table.increments('id');
            table
                .string('key')
                .unique()
                .notNullable();
            table
                .integer('update_id')
                .references('id')
                .inTable('updates')
                .onDelete('CASCADE');
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('update_images');
};

exports.config = { transaction: false };