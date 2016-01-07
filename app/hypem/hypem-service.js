/**
 * Starts CronJob which updates the current popular charts in a given interval
 *
 * @author Fabian Dietenberger
 */

'use strict';

import ChartsModel from '../model/charts-model';
import ChartsSongsModel from '../model/charts-songs-model';
import SongsModel from '../model/songs-model';

var hypemCrawler = require('./hypem-crawler'),
    CronJob = require('cron').CronJob,
    logger = require('winston'),
    async = require('async'),
    _ = require('lodash'),
    moment = require('moment');

var job;

module.exports = {
    start: function () {
        // cron format:
        // seconds minutes hours dayOfMonth months dayOfWeek
        job = new CronJob('0 */5 * * * *', function () {
            logger.info("Start updating charts");
            crawlAndSavePopularSongs(function () {
                logger.info("Finished updating charts");
            });
        }, null, null, null, null, true); // start on init
        job.start();
    },
    startNow: function (done) {
        crawlAndSavePopularSongs(done);
    },
    stop: function () {
        job.stop();
    }
};

/**
 * Crawl current charts from hypem and save them to the database.
 *
 * @param {Function}[done] gets executed when function is finished
 */
function crawlAndSavePopularSongs(done) {
    hypemCrawler.getAllPopularSongs(function (err, songs) {

        var popularSongPositions = [];

        async.forEach(songs, function (hypemSong, done) {
            saveOrUpdateSong(hypemSong, done);
        }, function (err) {
            if (err) {
                logger.error("Error saving popular songs. " + err);
                throw err;
            }
            createNewCharts(function (chart) {
                async.each(popularSongPositions, function (song, done) {
                    createForeignEntryBetweenChartsAndSongs(chart, song, done);
                }, function (err) {
                    if (err) {
                        logger.error("Error saving foreign keys between chart and songs. " + err);
                        throw err;
                    }
                    done();
                });
            });
        });

        /**
         * Create a new chart entry in the database with the current timestamp.
         *
         * @private
         * @param {Function}[callback] callback function
         * @param {[object]} callback.chart the saved chart
         */
        function createNewCharts(callback) {
            var chartToSave = {
                timestamp: moment(),
                type: 'popular'
            };

            new ChartsModel(chartToSave)
                .save()
                .then(function (chart) {
                    callback(chart);
                }).catch(function (err) {
                logger.error("Error saving chart. " + err);
                throw err;
            });
        }

        /**
         * Create an entry in the database which connects the chart and song.
         *
         * @private
         * @param chart the chart to connect to
         * @param song the song to connect to
         * @param {Function}[done] gets executed when function is finished
         */
        function createForeignEntryBetweenChartsAndSongs(chart, song, done) {
            new ChartsSongsModel({
                chart_id: chart.get('id'),
                song_id: song.songId,
                position: song.position
            }).save().then(function () {
                done();
            });
        }

        /**
         * Save the song or update the information if it already exists.
         *
         * @private
         * @param hypemSong the song to save or update
         * @param {Function}[done] gets executed when function is finished
         */
        function saveOrUpdateSong(hypemSong, done) {
            var position = hypemSong.position;

            new SongsModel().where('hypemMediaId', hypemSong.mediaid)
                .fetch()
                .then(function (song) {
                    if (song) {
                        updateSong(song, hypemSong.loved_count, done);
                        pushToPopularSongPositions(song.get('id'), position);
                    } else {
                        saveNewSong(hypemSong, function (song) {
                            pushToPopularSongPositions(song.get('id'), position);
                            done();
                        });
                    }
                }).catch(function (err) {
                logger.error("Error finding song in database. Cancel saving of the current charts. " + err);
                throw err;
            });
        }

        /**
         * Save a song to the database.
         *
         * @private
         * @param hypemSong the song to save
         * @param {Function}[callback] callback function
         * @param {[object]} callback.song the saved songs
         */
        function saveNewSong(hypemSong, callback) {
            var songToSave = {
                artist: hypemSong.artist,
                title: hypemSong.title,
                hypemMediaId: hypemSong.mediaid,
                hypemLovedCount: hypemSong.loved_count,
                streamUrl: hypemSong.streamUrl,
                soundcloudUrl: hypemSong.soundcloudUrl,
                soundcloudId: hypemSong.soundcloudId,
                waveformUrl: hypemSong.waveformUrl
            };

            new SongsModel(songToSave)
                .save()
                .then(function (song) {
                    callback(song);
                }).catch(function (err) {
                logger.error("Error inserting song into database. " + err);
                throw err;
            });
        }

        /**
         * Update the songs loved count
         *
         * @private
         * @param song the song to update
         * @param lovedCount the new loved count
         * @param {Function}[done] gets executed when function is finished
         */
        function updateSong(song, lovedCount, done) {
            song.save({hypemLovedCount: lovedCount})
                .then(function () {
                    done();
                });
        }

        /**
         * Push an entry to the popular songs array.
         *
         * @private
         * @param songId the id of the song to push
         * @param position the position of the song
         */
        function pushToPopularSongPositions(songId, position) {
            popularSongPositions.push({
                songId: songId,
                position: position
            });
        }
    });
}

