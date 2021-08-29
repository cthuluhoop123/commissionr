const knexfile = require('../knexfile.js');
const knex = require('knex')(knexfile[process.env.NODE_ENV]);

const { Model } = require('objection');

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

async function getUser(query) {
    const user = await User.query()
        .findOne(query);
    return user;
}

async function getCommissions(id) {
    const commissions = await Commission.query()
        .where({
            user_id: id
        });
    return commissions;
}

async function createCommission({ id: user_id, name }) {
    const commissions = await Commission.query()
        .insert({
            user_id,
            name
        });
    return commissions;
}

module.exports = {
    registerUser,
    getUser,
    getCommissions,
    createCommission
};