/**
 * @author Fabian Dietenberger
 */

'use strict';

require('chai').should();

var util = require('../../app/util');

describe('Check if url is a soundcloud url', function () {
    it('should return true if url is valid', function () {
        util.isSoundcloudUrl("https://soundcloud.com/porter-robinson/porter-robinson-divinity-odesza-remix").should.be.true;
        util.isSoundcloudUrl("http://soundcloud.com/porter-robinson/porter-robinson-divinity-odesza-remix").should.be.true;
        util.isSoundcloudUrl("https://api.soundcloud.com/tracks/225066758/stream").should.be.true;
    });
    it('should return false if url is not valid', function () {
        util.isSoundcloudUrl("fsefesf").should.be.false;
        util.isSoundcloudUrl().should.be.false;
        util.isSoundcloudUrl(undefined).should.be.false;
        util.isSoundcloudUrl(null).should.be.false;
        util.isSoundcloudUrl("https://soundcloud.com/not/found").should.be.false;
        util.isSoundcloudUrl("http://soundcloud.com/not/found").should.be.false;
        util.isSoundcloudUrl(123432).should.be.false;
    });
});
 
 
