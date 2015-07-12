var request = require('supertest');
var app = require('../../app.js');

describe('Request the song path', function (done) {
    it('should return 200 status code', function (done) {
        request(app)
            .get('/song/dwdawd')
            .expect(200, done);
    })
});