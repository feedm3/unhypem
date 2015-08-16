/**
 * Starts CronJob which updates the current popular songs in a given interval
 *
 * @author Fabian Dietenberger
 */

'use strict';

var hypemCrawler = require('./hypemCrawler'),
    CronJob = require('cron').CronJob,
    Songs = require('../model/songs').Songs,
    dbAdapter = require('../database/dbAdapter');

var job;

exports.start = function () {

    // seconds minutes hours dayOfMonth months dayOfWeek
    job = new CronJob('0 */5 * * * *', function () {
        startCrawler();
    });
    job.start();
};

exports.stop = function () {
    job.stop();
};

function startCrawler() {
    var d = new Date();
    var currentDate = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    console.log("Start updating songs...");
    hypemCrawler.updatePopularSongs(callbackSongsUpdated);
}

function callbackSongsUpdated(popularSongsDTO) {
    console.log("Updating finished.");
    dbAdapter.savePopularSongs(popularSongsDTO);
}