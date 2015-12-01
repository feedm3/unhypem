/**
 * Starts CronJob which updates the current popular songs in a given interval
 *
 * @author Fabian Dietenberger
 */

'use strict';

var hypemCrawler = require('./hypemCrawler'),
    CronJob = require('cron').CronJob,
    SongsModel = require('../model/songs'),
    ChartsModel = require('../model/charts'),
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
            //
            //Songs.findOne({hypemMediaId: songRaw.mediaid}, function (err, song) {
            //    if (err) {
            //        logger.error("Error finding song in database. " + err);
            //        throw err;
            //    }
            //    if (song) {
            //        song.hypemLovedCount.push({
            //            timestamp: moment(),
            //            count: songRaw.loved_count
            //        });
            //        song.save(function (err, song) {
            //            if (err) {
            //                logger.error("Could not update song in database. " + err);
            //                logger.error(song);
            //                throw err;
            //            }
            //            popularSongs.push({
            //                position: position,
            //                song: song._id
            //            });
            //            done();
            //        });
            //    } else {
            //        // song does not exist in database so we save it
            //        var songModel = new Songs({
            //            artist: songRaw.artist,
            //            title: songRaw.title,
            //            hypemMediaId: songRaw.mediaid,
            //            hypemLovedCount: {
            //                timestamp: moment(),
            //                count: songRaw.loved_count
            //            },
            //            streamUrl: songRaw.streamUrl,
            //            soundcloudUrl: songRaw.soundcloudUrl,
            //            soundcloudId: songRaw.soundcloudId,
            //            waveformUrl: songRaw.waveformUrl
            //        });
            //        songModel.save(function (err, song) {
            //            if (err) {
            //                logger.error("Could not save song to database. " + err);
            //                logger.error(song);
            //                throw err;
            //            }
            //            popularSongs.push({
            //                position: position,
            //                song: song._id
            //            });
            //            done();
            //        });
            //    }
            //});
        }, function (err) {
            if (err) {
                logger.error("Error saving popular songs. " + err);
                throw err;
            }
            new ChartsModel({
                timestamp: moment(),
                type: 'popular'
            }).save()
                .then(function (chartEntry) {
                    var chartId = chartEntry.get('id');
                    async.each(popularSongs, function (entry, finished) {
                        new ChartSongsModel({
                            chart_id: chartId,
                            song_id: entry.songId,
                            position: entry.position
                        }).save().return();
                    }, function (err) {
                        throw err;
                    });
                }).catch(function (err) {
                logger.error("Could not create chart. " + err);
                throw err;
            });
            //var charts = new ChartsModel({
            //    timestamp: moment(),
            //    songs: popularSongs
            //});
            //charts.save(function (err) {
            //    if (done) {
            //        done(err);
            //    }
            //    if (err) {
            //        logger.error("Error saving charts. " + err);
            //        throw err;
            //    }
            //    logger.info("ChartsModel saved");
            //});
        });
    });
}