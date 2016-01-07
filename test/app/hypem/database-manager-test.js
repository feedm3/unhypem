/**
 * @author Fabian Dietenberger
 */

'use strict';

require('chai').should();
require('dotenv').load();

import ChartsModel from '../../../app/model/charts-model';

var databaseManager = require('../../../app/hypem/database-manager'),
    hypemService = require('../../../app/hypem/hypem-service');

var numberOfChartsInDb = {};

before(function (done) {
    this.timeout(20000);
    hypemService.startNow(function () {
        hypemService.startNow(function () {
            hypemService.startNow(function () {
                ChartsModel
                    .forge()
                    .count()
                    .then(function (count) {
                        numberOfChartsInDb = count;
                        done();
                    });
            });
        });
    });
});

describe('Delete the chart history', function () {
    this.timeout(10000);
    it('should only remaing the current chart in the charts-songs table', function (done) {
        databaseManager.deleteChartsHistory(2, function () {
            ChartsModel
                .forge()
                .count()
                .then(function (count) {
                    count.should.equal('2');
                    done();
                });
        });
    });
});
 
 
