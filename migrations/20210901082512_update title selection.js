exports.up = function (knex) {
    return knex.schema
        .createTable('update_titles', function (table) {
            table.increments('id');
            table
                .integer('user_id')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');

            table
                .string('title')
                .unique()
                .notNullable();
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('update_titles')
};

exports.config = { transaction: false };