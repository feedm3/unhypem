/**
 * @author Fabian Dietenberger
 */

'use strict';

var request = require('supertest'),
    app = require('../../../app.js');

describe('Request the song path', function () {
    it('should return 200 status code', function (done) {
        request(app)
            .get('/song/dwdawd')
            .expect(200, done);
    });
});