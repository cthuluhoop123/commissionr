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

async function getUser(email) {
    const user = await User.query()
        .findOne({
            email
        });
    return user;
}

module.exports = {
    registerUser,
    getUser
};