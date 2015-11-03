/**
 * Starts CronJob which updates the current popular songs in a given interval
 *
 * @author Fabian Dietenberger
 */

'use strict';

var hypemCrawler = require('./hypemCrawler'),
    CronJob = require('cron').CronJob,
    Songs = require('../model/songs').Songs,
    Charts = require('../model/charts').Charts,
    logger = require('winston'),
    async = require('async'),
    _ = require('lodash'),
    moment = require('moment');

var job;

exports.start = function () {
    // seconds minutes hours dayOfMonth months dayOfWeek
    job = new CronJob('0 */5 * * * *', function () {
        logger.info("Start updating charts");
        crawlAndSavePopularSongs();
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
        async.each(songs, function (songRaw, done) {

            var position = _.findKey(songs, songRaw);

            Songs.findOne({hypemMediaId: songRaw.mediaid}, function (err, song) {
                if (err) {
                    logger.error("Error finding song in database. " + err);
                    throw err;
                }
                if (song) {
                    song.hypemLovedCount.push({
                        timestamp: moment(),
                        count: songRaw.loved_count
                    });
                    song.save(function (err, song) {
                        if (err) {
                            logger.error("Could not update song in database. " + err);
                            logger.error(song);
                            throw err;
                        }
                        popularSongs.push({
                            position: position,
                            song: song._id
                        });
                        done();
                    });
                } else {
                    // song does not exist in database so we save it
                    var songModel = new Songs({
                        artist: songRaw.artist,
                        title: songRaw.title,
                        hypemMediaId: songRaw.mediaid,
                        hypemLovedCount: {
                            timestamp: moment(),
                            count: songRaw.loved_count
                        },
                        streamUrl: songRaw.streamUrl,
                        soundcloudUrl: songRaw.soundcloudUrl,
                        soundcloudId: songRaw.soundcloudId,
                        waveformUrl: songRaw.waveformUrl
                    });
                    songModel.save(function (err, song) {
                        if (err) {
                            logger.error("Could not save song to database. " + err);
                            logger.error(song);
                            throw err;
                        }
                        popularSongs.push({
                            position: position,
                            song: song._id
                        });
                        done();
                    });
                }
            });
        }, function (err) {
            if (err) {
                logger.error("Error saving popular songs. " + err);
                throw err;
            }
            var charts = new Charts({
                timestamp: moment(),
                songs: popularSongs
            });
            charts.save(function (err) {
                if (done) {
                    done(err);
                }
                if (err) {
                    logger.error("Error saving charts. " + err);
                    throw err;
                }
                logger.info("Charts saved");
            });
        });
    });
}