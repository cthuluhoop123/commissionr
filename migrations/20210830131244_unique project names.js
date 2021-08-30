
exports.up = function (knex) {
    return knex.schema.table('commissions', function (table) {
        table.unique('name');
    });
};

exports.down = function (knex) {
    return knex.schema.table('commissions', function (table) {
        table.dropUnique('name');
    });
};
