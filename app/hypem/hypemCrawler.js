/**
 * @author Fabian Dietenberger
 */

'use strict';

var request = require('request'),
    async = require('async'),
    url = require('url'),
    _ = require('lodash'),
    util = require('../util'),
    hypemResolver = require('hypem-resolver');

var popularHypemSongs = {},
    hypemPopularLinks = [
        "http://hypem.com/playlist/popular/3day/json/1/data.js",
        "http://hypem.com/playlist/popular/3day/json/2/data.js",
        "http://hypem.com/playlist/popular/3day/json/3/data.js"
    ];

/**
 * This class is used to crawl all current popular songs from hypem
 * and extend the single songs with their streaming and soundcloud url.
 *
 * @returns {{getAllPopularSongs: getAllPopularSongs}}
 * @constructor
 */
var HypemCrawler = function () {

    /**
     * Get all songs from the current popular list with their streaming urls.
     *
     * @param {Function}[callback] callback function
     * @param {Error} callback.err null if no error occurred
     * @param {object} callback.songs the current songs (key: chart position; value: song)
     */
    function getAllPopularSongs(callback) {
        async.waterfall([
            function (done) {
                fetchAllPopularSongs(done);
            },
            function (done) {
                resolveStreamingUrls(done);
            }
        ], function (err) {
            if (err) {
                console.error("Could not crawl hypem songs");
                callback(err);
                return;
            }
            callback(null, popularHypemSongs);
        });
    }

    return {
        getAllPopularSongs: getAllPopularSongs
    };
};

module.exports = new HypemCrawler();

function fetchAllPopularSongs(done) {
    async.each(hypemPopularLinks, function (link, done) {

        var positionOffset = getPositionOffsetFromLink(link);
        var options = {
            method: "GET",
            url: link
        };

        request(options, function (error, response) {
            if (!error && response.statusCode === 200) {
                var hypemSongs = JSON.parse(response.body);
                _.forIn(hypemSongs, function (hypemSong, num) {
                    if (_.isObject(hypemSong)) {
                        var position = parseInt(num) + positionOffset + 1; // we start at 1 not 0
                        if (_.isEmpty(hypemSong.artist)) {
                            // there are some edge cases where the artist is
                            // not given a.e. http://hypem.com/track/2cvak/
                            hypemSong.artist = " ";
                        }
                        popularHypemSongs[position] = hypemSong;
                    }
                });
                done();
            }
        });
    }, function (err) {
        if (err) {
            console.error("Error parsing popular songs json form hypem. " + err);
            done(err);
            return;
        }
        done();
    });
}

function resolveStreamingUrls(done) {
    async.each(popularHypemSongs, function (song, done) {
        hypemResolver.getById(song.mediaid, function (err, url) {
            if (util.isSoundcloudUrl(url)) {
                fetchSoundcloudProperties(url, function (err, properties) {
                    if (err) {
                        console.error("Could not request soundcloud api with " + url);
                    } else {
                        if (properties.stream_url) {
                            song.streamUrl = properties.stream_url + "?client_id=" + process.env.SOUNDCLOUD_CLIENT_ID;
                        }
                        song.soundcloudId = properties.id;
                        song.waveformUrl = properties.waveform_url;
                    }
                    song.soundcloudUrl = url;
                    done();
                });
            } else {
                song.streamUrl = url;
                done();
            }
        });
    }, function (err) {
        if (err) {
            console.error("Error requesting soundcloud api for popular songs. " + err);
            done(err);
            return;
        }
        done();
    });
}

function fetchSoundcloudProperties(soundcloudUrl, callback) {
    var options = {
        method: "GET",
        url: "https://api.soundcloud.com/resolve.json?url=" + soundcloudUrl + "&client_id=" + process.env.SOUNDCLOUD_CLIENT_ID
    };
    request(options, function (error, response) {
        if (!error) {
            if (response.statusCode === 200) {
                callback(null, JSON.parse(response.body));
            } else {
                callback(new Error("Error resolving soundcloud properties from " + soundcloudUrl));
            }
        } else {
            callback(new Error("Error resolving soundcloud properties from " + soundcloudUrl));
        }
    });
}

function getPositionOffsetFromLink(link) {
    var pathname = url.parse(link).pathname; // example: '/playlist/popular/3day/json/1/data.js'
    var positionOffsetInLink = pathname.split('/')[5]; // example: '1'
    return 20 * (positionOffsetInLink - 1);
}
