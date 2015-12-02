/**
 * @author Fabian Dietenberger
 */

'use strict';

require('chai').should();

var request = require('supertest'),
    app = require('../../../app.js'),
    util = require('../../../app/util'),
    _ = require('lodash');

describe('Request the popular songs object', function () {
    this.timeout(5000);

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
                var songs = res.body.songs;
                _.keysIn(songs).should.have.length(50);
            })
            .end(done);
    });

    it('every song should have the needed fields', function (done) {
        request(app)
            .get('/popular')
            .expect(function (res) {
                var songs = res.body.songs;
                _.forEach(songs, function (song) {
                    if (song.position === 0) {
                        console.log(song);
                    }
                    song.position.should.be.within(1, 50);
                    song.should.include.all.keys(['artist', 'title', 'hypemMediaId', 'hypemLovedCount']);
                    if (util.isSoundcloudUrl(song.streamUrl)) {
                        song.should.include.all.keys(['soundcloudUrl', 'soundcloudId', 'waveformUrl']);
                    }
                });
            })
            .end(done);
    });

    it('should contain the timestamp', function (done) {
        request(app)
            .get('/popular')
            .expect(function (res) {
                res.body.timestamp.should.be.an('string');
            })
            .end(done);
    });
});

