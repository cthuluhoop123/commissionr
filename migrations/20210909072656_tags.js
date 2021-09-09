exports.up = function (knex) {
    return knex.schema
        .createTable('tags', function (table) {
            table.increments('id');

            table
                .integer('user_id')
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');

            table
                .string('tag')
                .notNullable()
                .unique();

            table
                .string('color', 6);
        })
        .createTable('commissions_tags', function (table) {
            table
                .integer('commission_id')
                .notNullable()
                .references('id')
                .inTable('commissions')
                .onDelete('CASCADE');

            table
                .integer('tag_id')
                .notNullable()
                .references('id')
                .inTable('tags')
                .onDelete('CASCADE');
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('tags')
        .dropTable('commissions_tags');
};

exports.config = { transaction: false };