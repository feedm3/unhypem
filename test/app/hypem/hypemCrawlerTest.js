/**
 * Test for {@link HypemCrawler}
 *
 * @author Fabian Dietenberger
 */

'use strict';

require('chai').should();

var hypemCrawler = require('../../../app/hypem/hypemCrawler'),
    _ = require('lodash');

describe.only('Resolve all songs on the popular list', function () {
    this.setTimeout = 10000;

    it('should return an object with 50 elements', function (done) {
        hypemCrawler.resolvePopularList(function (songs) {
            songs.should.be.a('Object');
            _.keys(songs).should.have.length(50);
            done();
        });
    });

});