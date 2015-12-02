/**
 * Test for {@link HypemCrawler}
 *
 * @author Fabian Dietenberger
 */

'use strict';

require('chai').should();

var hypemCrawler = require('../../../app/hypem/hypem-crawler'),
    _ = require('lodash');

describe('Resolve all songs on the popular list', function () {
    this.timeout(10000);

    it('should return an array with 50 elements', function (done) {
        hypemCrawler.getAllPopularSongs(function (err, songs) {
            songs.should.be.an('array');
            songs.should.have.length(50);
            done();
        });
    });

    it('every object should contain song informations', function (done) {
        hypemCrawler.getAllPopularSongs(function (err, songs) {
            _.forEach(songs, function (song) {
                /* note that at this point a song does have all fields from hypem */
                song.position.should.be.within(1, 50);

                song.artist.should.be.a('string');
                song.title.should.be.a('string');
                song.loved_count.should.be.a('number');
                song.mediaid.should.be.a('string');
            });
            done();
        });
    });
});