/**
 * @author Fabian Dietenberger
 */

'use strict';

require('chai').should();

var request = require('supertest'),
    app = require('../../../app.js'),
    _ = require('lodash');

describe('Request the popular songs object', function () {
    it('should return 200', function (done) {
        request(app)
            .get('/popular')
            .expect(200, done);
    });

    it('should be JSON', function (done) {
        request(app)
            .get('/popular')
            .expect('Content-Type', /json/)
            .end(done);
    });

    it('should contain 50 songs in body', function (done) {
        request(app)
            .get('/popular')
            .expect(function (res) {
                var songs = res.body;
                _.keysIn(songs).should.have.length(50);
            })
            .end(done);
    });

    it('every song should have the needed fields', function (done) {
        request(app)
            .get('/popular')
            .expect(function (res) {
                var songs = res.body;
                _.forEach(songs, function (song) {
                   song.should.have.all.keys(['artist', 'title', 'hypemMediaId', 'streamUrl', 'soundcloudUrl']);
                });
            })
            .end(done);
    });

    it('should contain the timestamp in the header', function (done) {
        request(app)
            .get('/popular')
            .expect('timestamp', /\d{2}:\d{2}:\d{2}/)
            .end(done);
    });
});

