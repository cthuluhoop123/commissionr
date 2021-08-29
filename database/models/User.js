const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get relationMappings() {
        const Commission = require('./Commission.js');
        return {
            commissions: {
                relation: Model.HasManyRelation,
                modelClass: Commission,
                join: {
                    from: 'users.id',
                    to: 'commissions.user_id'
                }
            }
        };
    }
}

module.exports = User;