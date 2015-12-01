/**
 * @author Fabian Dietenberger
 */

'use strict';

var app = require('../app'),
    db = require('../app/config/db'),
    migration =require('../app/config/migration'),
    hypemService = require('../app/hypem/hypemService');

before(function (done) {
    this.timeout(10000);

    app.set('port', process.env.PORT || 3000);
    migration.up(db.knex).then(function () {
        hypemService.startNow(function (err) {
                    if (err) {
                        throw err;
                    }
            console.log("Setup done");
            done();
        });
    }).catch(function (err) {
        throw err;
    });
});