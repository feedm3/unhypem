/**
 * Starts CronJob which updates the current popular songs in a given interval
 *
 * Created by Fabian on 19.10.2014.
 */

var hypemCrawler = require('./hypemCrawler');
var CronJob = require('cron').CronJob;
var dbAdapter = require('./dbAdapter');

var job;
var lockedInARow;

exports.start = function() {
    lockedInARow = 0;

    // seconds minutes hours dayOfMonth months dayOfWeek
    job = new CronJob('0 */5 * * * *', function() {
        if (hypemCrawler.isLocked()) {
            lockedInARow++;
            console.log("Could not start crawling job " + lockedInARow + " times in a row.");
        } else {
            startCrawler();
        }
    });
    job.start();
};

exports.stop = function() {
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