/**
 * @author Fabian Dietenberger
 */

'use strict';

const request = require('supertest');
const app = require('../../../app.js');

describe('Request the root path', function() {
    it('should return 200 status code', function(done) {
        request(app)
            .get('/')
            .expect(200, done);
    });
});
