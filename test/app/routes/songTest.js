/**
 * @author Fabian Dietenberger
 */

'use strict';

var request = require('supertest'),
    app = require('../../../app.js');

describe('Request the song path', function () {
    describe('if the media id is correct', function () {
        // TODO fdi take the song id from the currect charts
        it('should return 200', function (done) {
            request(app)
                .get('/songs/2d0f2')
                .expect(200, done);
        });

        it('should contain all needed fields', function (done) {
            request(app)
                .get('/songs/2d0f2')
                .expect(function (res) {
                    var song = res.body;
                    song.should.have.all.keys(['artist', 'title', 'hypemMediaId', 'hypemLovedCount', 'streamUrl', 'soundcloudUrl', 'soundcloudId', 'waveformUrl']);
                })
                .end(done);
        });
    });

    describe('if the media id does not exist', function () {
        it('should return 404', function (done) {
            request(app)
                .get('/songs/ddwadwdawd')
                .expect(404, done);
        });
    });

    describe('if no media id is given', function () {
        it('should return 404', function (done) {
            request(app)
                .get('/songs')
                .expect(404, done);
        });
    });
});