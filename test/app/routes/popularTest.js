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
                _.forEach(songs, function (song, position) {
                    position.should.be.above(0);
                    position.should.be.below(51);
                    song.should.include.all.keys(['artist', 'title', 'hypemMediaId', 'hypemLovedCount', 'streamUrl']);
                    // we dont test for 'soundcloudUrl', 'soundcloudId', 'waveformUrl'
                    // because sometimes the song is not hosted on soundcloud
                    // TODO make isSoundcloud() method into a utils module
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

