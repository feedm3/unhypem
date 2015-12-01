/**
 * @author Fabian Dietenberger
 */

'use strict';

var knex = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

var db = require('bookshelf')(knex);
db.plugin('registry');
module.exports = db;