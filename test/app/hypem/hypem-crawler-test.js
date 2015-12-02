/**
 * Test for {@link HypemCrawler}
 *
 * @author Fabian Dietenberger
 */

'use strict';

require('chai').should();

var hypemCrawler = require('../../../app/hypem/hypem-crawler'),
    _ = require('lodash'),
    util = require('../../../app/util');

describe('Resolve all songs on the popular list', function () {
    this.timeout(10000);

    it('should return an object with 50 elements', function (done) {
        hypemCrawler.getAllPopularSongs(function (err, songs) {
            songs.should.be.a('object');
            _.keys(songs).should.have.length(50);
            done();
        });
    });

    it('every object should contain song informations', function (done) {
        hypemCrawler.getAllPopularSongs(function (err, songs) {
            _.forIn(songs, function (song, num) {
                /* note that at this point a song does have all fields from hypem */
                num.should.be.above(0);
                num.should.be.below(51);

                song.artist.should.be.a('string');
                song.title.should.be.a('string');
                song.loved_count.should.be.a('number');
                song.mediaid.should.be.a('string');
            });
            done();
        });
    });
});