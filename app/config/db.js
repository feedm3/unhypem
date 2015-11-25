/**
 * @author Fabian Dietenberger
 */

'use strict';

var knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        database: 'unhypem',
        user: 'postgres',
        password: 'admin'
    }
});

var db = require('bookshelf')(knex);
module.exports = db;