/**
 * @author Fabian Dietenberger
 */

'use strict';

/**
 * This class is used to crawl all current popular songs from hypem
 * and extend the songs data with their streaming and soundcloud url.
 *
 * @returns {{getAllPopularSongs: getAllPopularSongs}}
 * @constructor
 */
const HypemCrawler = function() {
    const HYPEM_POPULAR_JSON_LINKS = [
        'http://hypem.com/playlist/popular/3day/json/1/data.js',
        'http://hypem.com/playlist/popular/3day/json/2/data.js',
        'http://hypem.com/playlist/popular/3day/json/3/data.js'
    ];

    const request = require('request');
    const async = require('async');
    const url = require('url');
    const logger = require('winston');
    const _ = require('lodash');
    const util = require('../util');
    const hypemResolver = require('hypem-resolver');

    /**
     * Get all songs from the current popular list with their streaming urls.
     *
     * @param {Function}[callback] callback function
     * @param {Error=} callback.err null if no error occurred
     * @param {[object]} callback.songs the current popular songs
     */
    function getAllPopularSongs(callback) {
        const songsResult = [];

        async.waterfall([
            function(done) {
                getAllSongsFromHypemPopularJson(songsResult, done);
            },
            function(done) {
                addStreamingUrlAndSoundcloudInfoToAllSongs(songsResult, done);
            }
        ], function(err) {
            if (err) {
                logger.error('Could not crawl hypem songs');
                callback(err);
                return;
            }
            callback(null, songsResult);
        });
    }

    return {
        getAllPopularSongs: getAllPopularSongs
    };

    /**
     * Download popular songs list (json files) from hypem and save
     * the songs inside the popularHypemSongResults object.
     *
     * @private
     * @param {[object]} songs object to save the songs
     * @param {Function}[done] gets called when all songs are loaded, parsed and saved
     * @param {Error=} done.err null if no error occurred
     */
    function getAllSongsFromHypemPopularJson(songs, done) {
        async.each(HYPEM_POPULAR_JSON_LINKS, function(link, done) {
            getSongsFromHypemPopularJson(songs, link, done);
        }, function(err) {
            if (err) {
                logger.error('Error parsing popular songs json form hypem. ' + err);
                done(err);
                return;
            }
            done();
        });
    }

    /**
     * Download songs json and save them inside the popularHypemSongResults object.
     *
     * @private
     * @param {[object]} songs object to save the songs
     * @param {string} hypemLink the link to the songs json
     * @param {Function}[done] gets called when all songs are loaded and saved
     * @param {Error=} done.err null if no error occurred
     */
    function getSongsFromHypemPopularJson(songs, hypemLink, done) {
        const options = {
            method: 'GET',
            url: hypemLink
        };
        request(options, function(error, response) {
            if (error) {
                done(error);
            }
            if (!error && response.statusCode === 200) {
                const songPositionOffset = getPositionOffsetFromLink(hypemLink);
                const hypemSongs = JSON.parse(response.body);
                _.forIn(hypemSongs, function(hypemSong, num) {
                    if (_.isObject(hypemSong)) {
                        hypemSong.position = parseInt(num, 10) + songPositionOffset + 1; // we start at 1 not 0
                        if (_.isEmpty(hypemSong.artist)) {
                            // there are some edge cases where the artist is
                            // not given a.e. http://hypem.com/track/2cvak/
                            hypemSong.artist = ' ';
                        }
                        songs.push(hypemSong);
                    }
                });
                done();
            }
        });
    }

    /**
     * Get the streaming url and some properties from soundcloud
     * to all songs.
     *
     * @private
     * @param {[object]} songs the songs to add the streaming url and soundcloud properties
     * @param {Function}[done] gets called when all properties are set
     * @param {Error=} done.err null if no error occurred
     */
    function addStreamingUrlAndSoundcloudInfoToAllSongs(songs, done) {
        async.forEach(songs, function(song, done) {
            hypemResolver.getById(song.mediaid, function(err, url) {
                if (err) throw err;
                if (util.isSoundcloudUrl(url)) {
                    getSoundcloudProperties(url, function(err, properties) {
                        song.soundcloudUrl = url;
                        if (err) {
                            logger.info('Could not request soundcloud api with ' + url);
                        } else {
                            if (properties.stream_url) {
                                song.streamUrl = properties.stream_url;
                            }
                            song.soundcloudId = properties.id;
                            song.waveformUrl = properties.waveform_url;
                        }
                        done();
                    });
                } else {
                    song.streamUrl = url;
                    done();
                }
            });
        }, function(err) {
            if (err) {
                logger.error('Error requesting soundcloud api for popular songs. ' + err);
                done(err);
                return;
            }
            done();
        });
    }

    /**
     * Get the properties object to the given soundcloud url.
     *
     * @private
     * @param {string} soundcloudUrl the url to get the properties
     * @param {Function}[callback] gets called when properties are loaded
     * @param {Error=} callback.err null if no error occurred
     * @param {object} callback.properties soundcloud properties object
     */
    function getSoundcloudProperties(soundcloudUrl, callback) {
        const options = {
            method: 'GET',
            url: 'https://api.soundcloud.com/resolve.json?url=' + soundcloudUrl + '&client_id=' + process.env.SOUNDCLOUD_CLIENT_ID
        };
        request(options, function(error, response) {
            if (!error && response.statusCode === 200) {
                callback(null, JSON.parse(response.body));
            } else {
                callback(new Error('Error resolving soundcloud properties from ' + soundcloudUrl));
            }
        });
    }

    /**
     * Get the offset of the popular json list from hypem.
     * Their top 50 songs are split into 3 json files in which
     * the first song is always at the first position. So
     * we have to add the positions offset from the last file.
     *
     * @private
     * @param {string} link the link to the json file
     * @returns {number} the positions offset to add to the songs inside the json file
     */
    function getPositionOffsetFromLink(link) {
        const pathname = url.parse(link).pathname; // example: '/playlist/popular/3day/json/1/data.js'
        const positionOffsetInLink = pathname.split('/')[5]; // example: '1'
        return 20 * (positionOffsetInLink - 1);
    }
};

module.exports = new HypemCrawler();

