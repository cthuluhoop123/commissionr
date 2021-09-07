const { Model } = require('objection');

class Update extends Model {
    static get tableName() {
        return 'updates';
    }

    static get relationMappings() {
        const Commission = require('./Commission.js');
        const UpdateImages = require('./UpdateImages.js');
        return {
            commission: {
                relation: Model.BelongsToOneRelation,
                modelClass: Commission,
                join: {
                    from: 'updates.commission_id',
                    to: 'commissions.id'
                }
            },
            images: {
                relation: Model.HasManyRelation,
                modelClass: UpdateImages,
                join: {
                    from: 'updates.id',
                    to: 'update_images.update_id'
                },
                filter: query => { query.select(['key']) },
            }
        };
    }
}

module.exports = Update;