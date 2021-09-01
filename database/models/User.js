const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get relationMappings() {
        const Commission = require('./Commission.js');
        const Update = require('./Update.js');
        return {
            commissions: {
                relation: Model.HasManyRelation,
                modelClass: Commission,
                join: {
                    from: 'users.id',
                    to: 'commissions.user_id'
                }
            },
            updateTitles: {
                relation: Model.HasManyRelation,
                modelClass: Update,
                join: {
                    from: 'users.id',
                    to: 'update_titles.user_id'
                }
            }
        };
    }
}

module.exports = User;