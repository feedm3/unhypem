/**
 * @author Fabian Dietenberger
 */

'use strict';

require('dotenv').config();

const knex = require('knex')({
    pool: {
        min: 2,
        max: 10
    },
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const db = require('bookshelf')(knex);
db.plugin('registry');

export default db;
