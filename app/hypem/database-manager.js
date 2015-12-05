/**
 * @author Fabian Dietenberger
 */

'use strict';

var CronJob = require('cron').CronJob,
    ChartsSongsModel = require('../model/charts-songs-model'),
    ChartsModel = require('../model/charts-model'),
    logger = require('winston');

/**
 * Delete every chart entry in the database except the 10 latest.
 * Does not effect the songs!
 *
 * @param numberOfChartsToKeep {number} the number of charts to keep (latest)
 * @param {Function}[done] gets called when all charts are deleted
 */
var deleteChartsHistory = function (numberOfChartsToKeep, done) {
    ChartsModel
        .forge()
        .latest()
        .fetch()
        .then(function (chart) {
            var chartId = chart.get("id");
            var chartsToDelete = chartId - numberOfChartsToKeep + 1;
            ChartsSongsModel
                .forge()
                .where('chart_id', '<', chartsToDelete)
                .destroy()
                .then(function () {
                    ChartsModel
                        .forge()
                        .where('id', '<', chartsToDelete)
                        .destroy()
                        .then(function () {
                            done();
                        });
                });
            console.log(chart);
        });
};

module.exports = {
    deleteChartsHistoryEveryHour: function () {
        // cron format:
        // seconds minutes hours dayOfMonth months dayOfWeek
        var job = new CronJob('0 0 */1 * * *', function () {
            logger.info("Start clearing chats-songs table");
            deleteChartsHistory(10, function () {
                logger.info("Finished clearing chats-songs table");
            });
        }, null, null, null, null, true); // start on init
        job.start();
    },
    deleteChartsHistory: deleteChartsHistory
};