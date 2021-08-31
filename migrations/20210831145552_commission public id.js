
exports.up = function (knex) {
    return knex.schema.table('commissions', function (table) {
        table.string('tracking_id').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.table('commissions', function (table) {
        table.dropColumn('tracking_id');
    });
};