const { Model } = require('objection');

class Commission extends Model {
    static get tableName() {
        return 'commissions';
    }

    static get relationMappings() {
        const User = require('./User.js');
        const Update = require('./Update.js');
        return {
            artist: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                filter: query => { query.select(['id', 'artist_name']) },
                join: {
                    from: 'commissions.user_id',
                    to: 'users.id'
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