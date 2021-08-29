const { Model } = require('objection');

class Update extends Model {
    static get tableName() {
        return 'updates';
    }

    static get relationMappings() {
        const Commission = require('./Commission.js');
        return {
            commission: {
                relation: Model.BelongsToOneRelation,
                modelClass: Commission,
                join: {
                    from: 'updates.commission_id',
                    to: 'commissions.id'
                }
            }
        };
    }
}

module.exports = Update;