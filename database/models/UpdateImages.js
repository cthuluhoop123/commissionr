const { Model } = require('objection');

class UpdateTitle extends Model {
    static get tableName() {
        return 'update_images';
    }

    static get relationMappings() {
        const Update = require('./Update.js');
        return {
            update: {
                relation: Model.BelongsToOneRelation,
                modelClass: Update,
                join: {
                    from: 'update_images.update_id',
                    to: 'update.id'
                }
            }
        };
    }
}

module.exports = UpdateTitle;