
exports.up = function (knex) {
    return knex.schema.table('commissions', function (table) {
        table.string('status');
    });
};

exports.down = function (knex) {
    return knex.schema.table('commissions', function (table) {
        table.dropColumn('status');
    });
};