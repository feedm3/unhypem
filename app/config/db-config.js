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

var createTablesIfNotExist = function () {
    return knex.schema.hasTable('songs').then(function (exists) {
        if (!exists) {
            console.log('created table:', 'songs');
            return knex.schema.createTable('songs', function (table) {
                table.increments('id').primary();
                table.string('artist');
                table.string('title');
                table.string('hypemMediaId', 10);
                table.integer('hypemLovedCount', 7);
                table.string('streamUrl');
                table.string('soundcloudUrl');
                table.string('soundcloudId', 20);
                table.string('waveformUrl');
            });
        }
    }).then(function () {
        return knex.schema.hasTable('charts').then(function (exists) {
            if (!exists) {
                console.log('created table:', 'charts');
                return knex.schema.createTable('charts', function (table) {
                    table.increments('id').primary();
                    table.timestamp('time', 100);
                });
            }
        });
    }).then(function () {
        return knex.schema.hasTable('chartSongs').then(function (exists) {
            if (!exists) {
                console.log('created table:', 'chartSongs');
                return knex.schema.createTable('chartSongs', function (table) {
                    table.increments('id').primary();
                    table.integer('charts_id')
                        .unsigned()
                        .references('id')
                        .inTable('charts');
                    table.integer('songs_id')
                        .unsigned()
                        .references('id')
                        .inTable('songs');
                });
            }
        });
    });
};

var db = require('bookshelf')(knex);
module.exports = {
    db: db,
    createTablesIfNotExist: createTablesIfNotExist
};