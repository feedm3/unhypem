/**
 * @author Fabian Dietenberger
 */

'use strict';

var request = require('supertest'),
    app = require('../../../app.js');

describe('Request the root path', function () {
    it('should return 200 status code', function (done) {
        request(app)
            .get('/')
            .expect(200, done);
    });
});