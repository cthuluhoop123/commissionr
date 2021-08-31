
exports.up = function (knex) {
    return knex.schema.table('updates', function (table) {
        table.timestamps(true, true);
        table.string('title').notNullable();
        table.string('description');
    });
};

exports.down = function (knex) {
    return knex.schema.table('updates', function (table) {
        table.dropTimestamps();
        table.dropColumn('title');
        table.dropColumn('description');
    });
};
