/**
 * @author Fabian Dietenberger
 */

'use strict';

var request = require('supertest'),
    app = require('../../../app.js');

describe('Request the song path', function () {
    describe('if the media id is correct', function () {

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