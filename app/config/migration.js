/**
 * @author Fabian Dietenberger
 */

'use strict';

const logger = require('winston');

const up = function(knex) {
    return knex.schema.hasTable('songs').then(function(exists) {
        if (!exists) {
            logger.info('created table: songs');
            return knex.schema.createTable('songs', function(table) {
                table.increments('id').primary();
                table.string('artist');
                table.string('title');
                table.string('hypemMediaId', 10);
                table.integer('hypemLovedCount', 7); // must be in own table with timestamp (love history)
                table.string('streamUrl');
                table.string('soundcloudUrl');
                table.string('soundcloudId', 20);
                table.string('waveformUrl');
            });
        }
    }).then(function() {
        return knex.schema.hasTable('charts').then(function(exists) {
            if (!exists) {
                logger.info('created table: charts');
                return knex.schema.createTable('charts', function(table) {
                    table.increments('id').primary();
                    table.timestamp('timestamp', 100);
                    table.enu('type', ['popular', 'remix-only', 'no-remix']).defaultTo('popular');
                });
            }
        });
    }).then(function() {
        return knex.schema.hasTable('charts_songs').then(function(exists) {
            if (!exists) {
                logger.info('created table: charts_songs');
                return knex.schema.createTable('charts_songs', function(table) {
                    table.integer('chart_id')
                        .unsigned()
                        .references('id')
                        .inTable('charts');
                    table.integer('song_id')
                        .unsigned()
                        .references('id')
                        .inTable('songs');
                    table.integer('position').notNull();
                    table.unique(['chart_id', 'song_id']);
                });
            }
        });
    });
};

module.exports.up = up;
