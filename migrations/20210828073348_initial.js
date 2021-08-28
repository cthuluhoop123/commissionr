exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id');
            table.string('artist_name').notNullable();
            table.string('email').notNullable();
            table.string('password_hash').notNullable();
        })
        .createTable('commissions', function (table) {
            table.increments('id');
            table
                .integer('user_id')
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');

            table.string('name').notNullable();
        })
        .createTable('updates', function (table) {
            table.increments('id');
            table
                .integer('commission_id')
                .notNullable()
                .references('id')
                .inTable('commissions')
                .onDelete('CASCADE');
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('users')
        .dropTable('commissions')
        .dropTable('updates');
};

exports.config = { transaction: false };