/**
 * @author Fabian Dietenberger
 */

'use strict';

var app = require('../app'),
    mongoose = require('mongoose'),
    hypemService = require('../app/hypem/hypemService');

before(function (done) {
    this.timeout(10000);

    app.set('port', process.env.PORT || 3000);

    mongoose.createConnection('mongodb://' + process.env.MONGOLAB_URI, function (err) {
        if (err) {
            throw err;
        }
        hypemService.startNow(function (err) {
            if (err) {
                throw err;
            }
            console.log("Setup done");
            done();
        });
    });

});