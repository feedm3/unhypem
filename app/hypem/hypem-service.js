/**
 * Starts CronJob which updates the current popular songs in a given interval
 *
 * @author Fabian Dietenberger
 */

'use strict';

var hypemCrawler = require('./hypem-crawler'),
    CronJob = require('cron').CronJob,
    SongsModel = require('../model/songs-model'),
    ChartsModel = require('../model/charts-model'),
    ChartSongsModel = require('../model/chart-songs-model'),
    logger = require('winston'),
    async = require('async'),
    _ = require('lodash'),
    moment = require('moment');

var job;

exports.start = function () {
    // seconds minutes hours dayOfMonth months dayOfWeek
    job = new CronJob('0 */5 * * * *', function () {
        logger.info("Start updating charts");
        crawlAndSavePopularSongs(function () {
            logger.info("Charts updated");
        });
    });
    job.start();
};

exports.startNow = function (done) {
    crawlAndSavePopularSongs(done);
};

exports.stop = function () {
    job.stop();
};

function crawlAndSavePopularSongs(done) {
    hypemCrawler.getAllPopularSongs(function (err, songs) {
        var popularSongs = [];
        async.forEach(songs, function (songRaw, done) {

            var position = songRaw.position;

            new SongsModel().where('hypemMediaId', songRaw.mediaid)
                .fetch()
                .then(function (song) {
                    if (song) {
                        song.set('hypemLovedCount', songRaw.loved_count);
                        popularSongs.push({
                            position: position,
                            songId: song.get('id')
                        });
                        done();
                    } else {
                        new SongsModel({
                            artist: songRaw.artist,
                            title: songRaw.title,
                            hypemMediaId: songRaw.mediaid,
                            hypemLovedCount: songRaw.loved_count,
                            streamUrl: songRaw.streamUrl,
                            soundcloudUrl: songRaw.soundcloudUrl,
                            soundcloudId: songRaw.soundcloudId,
                            waveformUrl: songRaw.waveformUrl
                        }).save()
                            .then(function (song) {
                                popularSongs.push({
                                    position: position,
                                    songId: song.get('id')
                                });
                                done();
                            }).catch(function (err) {
                            logger.error("Error inserting song into database. " + err);
                            throw err;
                        });
                    }
                }).catch(function (err) {
                logger.error("Error finding song in database. So saving will also be cancelled. " + err);
                throw err;
            });
        }, function (err) {
            if (err) {
                logger.error("Error saving popular songs. " + err);
                throw err;
            }
            new ChartsModel({
                timestamp: moment(),
                type: 'popular'
            })
                .save()
                .then(function (chartEntry) {
                    var chartId = chartEntry.get('id');
                    async.each(popularSongs, function (entry, done) {
                        new ChartSongsModel({
                            chart_id: chartId,
                            song_id: entry.songId,
                            position: entry.position
                        }).save().then(function () {
                            done();
                        });
                    }, function (err) {
                        if (err) {
                            throw err;
                        }
                        done();
                    });
                })
                .catch(function (err) {
                    logger.error("Could not create chart. " + err);
                    throw err;
                });
        });
    });
}