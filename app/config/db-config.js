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

var up = function () {
    return knex.schema.hasTable('songs').then(function (exists) {
        if (!exists) {
            console.log('created table:', 'songs');
            return knex.schema.createTable('songs', function (table) {
                table.increments('id').primary();
                table.string('artist', 100);
                table.string('title', 100);
            });
        }
    }).then(function () {
        knex.schema.hasTable('charts').then(function (exists) {
            if (!exists) {
                console.log('created table:', 'charts');
                return knex.schema.createTable('charts', function (table) {
                    table.increments('id').primary();
                    table.integer('song_id', 100);
                });
            }
        });
    });
};

var db = require('bookshelf')(knex);
module.exports = {
    db: db,
    up: up
};