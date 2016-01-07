/**
 * @author Fabian Dietenberger
 */

'use strict';

import { CronJob } from 'cron';
import * as logger from 'winston';
import ChartsModel from '../model/charts-model';
import ChartsSongsModel from '../model/charts-songs-model';

/**
 * Delete every chart entry in the database except the 10 latest.
 * Does not effect the songs!
 *
 * @param numberOfChartsToKeep {number} the number of charts to keep (latest)
 * @param {Function}[done] gets called when all charts are deleted
 */
function deleteChartsHistory(numberOfChartsToKeep, done) {
    ChartsModel
        .forge()
        .latest()
        .fetch()
        .then(function(chart) {
            const chartId = chart.get('id');
            const chartsToDelete = chartId - numberOfChartsToKeep + 1;
            ChartsSongsModel
                .forge()
                .where('chart_id', '<', chartsToDelete)
                .destroy()
                .then(function() {
                    ChartsModel
                        .forge()
                        .where('id', '<', chartsToDelete)
                        .destroy()
                        .then(function() {
                            done();
                        });
                });
        });
}

function deleteChartsHistoryEveryHour() {
    // cron format:
    // seconds minutes hours dayOfMonth months dayOfWeek
    const job = new CronJob('0 0 */1 * * *', function() {
        logger.info('Start clearing chats-songs table');
        deleteChartsHistory(10, function() {
            logger.info('Finished clearing chats-songs table');
        });
    }, null, null, null, null, true); // start on init
    job.start();
}

export {
    deleteChartsHistoryEveryHour,
    deleteChartsHistory
};
