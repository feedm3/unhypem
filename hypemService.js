/**
 * Starts CronJob which updates the current popular songs in a given interval
 *
 * Created by Fabian on 19.10.2014.
 */

var hypemCrawler = require('./hypemCrawler');
var CronJob = require('cron').CronJob;

var job;

exports.start = function() {
    // seconds minutes hours dayOfMonth months dayOfWeek
    job = new CronJob('0 */1 * * * *', function() {
        var d = new Date();
        var currentDate = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        console.log(currentDate + ": Updating songs...");
        hypemCrawler.updatePopularSongs();
    });
    job.start();
};

exports.stop = function() {
    job.stop();
};