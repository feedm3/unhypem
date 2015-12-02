/**
 * @author Fabian Dietenberger
 */

'use strict';

var hypemService = require('../app/hypem/hypem-service');

before(function (done) {
    this.timeout(10000);

    hypemService.startNow(function (err) {
        if (err) {
            throw err;
        }
        console.log("Setup done");
        done();
    });
});