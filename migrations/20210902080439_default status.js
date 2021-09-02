
exports.up = function (knex) {
    return knex.schema.table('commissions', function (table) {
        table.string('status').defaultTo('Waiting').alter();
    });
};

exports.down = function (knex) {
    return knex.schema.table('commissions', function (table) {
        table.string('status').defaultTo(null).alter();
    });
};