/**
 * @author Fabian Dietenberger
 */

'use strict';

import { CronJob } from 'cron';
import * as logger from 'winston';
import ChartsModel from '../model/charts-model';
import ChartsSongsModel from '../model/charts-songs-model';
import _ from 'lodash';

/**
 * Delete every chart entry in the database except the latest 10.
 * This does not effect the songs!
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
            if (_.isNull(chart)) return;
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
