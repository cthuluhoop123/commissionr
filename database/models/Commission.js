const { Model } = require('objection');

class Commission extends Model {
    static get tableName() {
        return 'commissions';
    }

    static get relationMappings() {
        const User = require('./User.js');
        const Update = require('./Update.js');
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'commissions.user_id',
                    to: 'user.id'
                }
            },
            updates: {
                relation: Model.HasManyRelation,
                modelClass: Update,
                join: {
                    from: 'commissions.id',
                    to: 'updates.commission_id'
                }
            }
        };
    }
}

module.exports = Commission;