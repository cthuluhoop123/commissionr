const knexfile = require('../knexfile.js');
const knex = require('knex')(knexfile[process.env.NODE_ENV]);

const { Model } = require('objection');

const uuid = require('uuid').v4;

Model.knex(knex);

const Commission = require('./models/Commission.js');
const User = require('./models/User.js');
const Update = require('./models/Update.js');

async function registerUser({ email, artistName, passwordHash }) {
    const user = await User.query().insert({
        email,
        artist_name: artistName,
        password_hash: passwordHash
    });
    return user;
}

async function getUser(query, forPublic = false) {
    const dbQuery = User.query()
        .findOne(query);
    if (forPublic) {
        dbQuery.select(['id', 'artist_name']);
    }
    const user = await dbQuery;
    return user;
}

async function getCommissions(id) {
    const commissions = await Commission.query()
        .where({
            user_id: id
        });
    return commissions;
}

async function getCommission(id) {
    const commission = await Commission.query()
        .findById(id)
        .withGraphFetched('artist');
    return commission;
}

async function getCommissionTracking(trackingId) {
    const commission = await Commission.query()
        .where({
            tracking_id: trackingId
        })
        .withGraphFetched('artist');
    return commission[0];
}


async function createCommission({ id: user_id, projectName, clientName }) {
    const commissions = await Commission.query()
        .insert({
            user_id,
            name: projectName,
            client_name: clientName,
            tracking_id: uuid()
        });
    return commissions;
}

async function editCommission({ id, projectName, clientName }) {
    const commission = await Commission.query()
        .update({
            name: projectName,
            client_name: clientName
        })
        .where('id', id);
    return { id, projectName, clientName };
}

async function getUpdates(commissionId) {
    const updates = await Update.query()
        .where({
            commission_id: commissionId
        })
        .orderBy('created_at', 'DESC');
    return updates;
}

async function getUpdatesTracking(trackingId) {
    const commission = await getCommissionTracking(trackingId);
    if (!commission) { return []; }

    const updates = await Update.query()
        .where({
            commission_id: commission.id
        })
        .orderBy('created_at', 'DESC');
    return updates;
}

async function createUpdate({ commissionId, title, description }) {
    const update = await Update.query()
        .insert({
            commission_id: commissionId,
            title,
            description
        });
    return update;
}

async function isCommissionOwner(userId, commissionId) {
    const commission = await getCommission(commissionId);
    if (!commission) {
        return false;
    }
    return commission.user_id === userId;
}

module.exports = {
    registerUser,
    getUser,
    getCommissions,
    getCommission,
    getCommissionTracking,
    editCommission,
    createCommission,
    getUpdates,
    getUpdatesTracking,
    createUpdate,
    isCommissionOwner
};