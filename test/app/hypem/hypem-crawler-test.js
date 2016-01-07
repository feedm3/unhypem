/**
 * Test for {@link HypemCrawler}
 *
 * @author Fabian Dietenberger
 */

'use strict';

import chai from 'chai';
chai.should();

const hypemCrawler = require('../../../app/hypem/hypem-crawler');
const _ = require('lodash');

describe('Resolve all songs on the popular list', function() {
    this.timeout(20000);

    it('should return an array with 50 elements', function(done) {
        hypemCrawler.getAllPopularSongs(function(err, songs) {
            if (err) throw err;
            songs.should.be.an('array');
            songs.should.have.length(50);
            done();
        });
    });

    it('every object should contain song informations', function(done) {
        hypemCrawler.getAllPopularSongs(function(err, songs) {
            if (err) throw err;
            _.forEach(songs, function(song) {
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
