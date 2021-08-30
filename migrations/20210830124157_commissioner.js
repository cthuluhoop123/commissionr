
exports.up = function (knex) {
    return knex.schema.table('commissions', function (table) {
        table.string('client_name')
            .notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.table('commissions', function (table) {
        table.dropColumn('client_name');
    });
};
