const { Model } = require('objection');

class UpdateTitle extends Model {
    static get tableName() {
        return 'update_titles';
    }

    static get relationMappings() {
        const User = require('./User.js');
        return {
            commission: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'update_titles.user_id',
                    to: 'users.id'
                }
            }
        };
    }
}

module.exports = UpdateTitle;