/**
 * @author Fabian Dietenberger
 */

'use strict';

var request = require('supertest'),
    app = require('../../../app.js'),
    _ = require('lodash');

describe('Request the popular songs object', function () {
    it('should return 200 status code', function (done) {
        request(app)
            .get('/popular')
            .expect(200, done);
    });

    it('should be JSON', function (done) {
        request(app)
            .get('/popular')
            .expect('Content-Type', /json/)
            .end(function (error) {
                if (error) {
                    throw error;
                }
                done();
            });
    });

    it('should contain 50 songs in body', function (done) {
        request(app)
            .get('/popular')
            .expect(function (response) {
                var songs = JSON.parse(response.text);
                var songCount = _.keysIn(songs);

                if(songCount.length !== 50) {
                    throw "There must be 50 songs";
                }
            })
            .end(function (error) {
                if (error) {
                    throw error;
                }
                done();
            });
    });

    it('should contain the timestamp in the header', function (done) {
        request(app)
            .get('/popular')
            .expect('timestamp', /\d{2}:\d{2}:\d{2}/)
            .end(done);
    });
});

