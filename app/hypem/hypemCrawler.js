/**
 * This class is used to crawl all current popular songs from hypem
 * and extend the single songs with their streaming and soundcloud url.
 *
 * @author Fabian Dietenberger
 */

'use strict';

var request = require('request'),
    async = require('async'),
    url = require('url'),
    _ = require('lodash'),
    hypemResolver = require('hypem-resolver');

var popularHypemSongs = {},
    hypemPopularLinks = [
        "http://hypem.com/playlist/popular/3day/json/1/data.js",
        "http://hypem.com/playlist/popular/3day/json/2/data.js",
        "http://hypem.com/playlist/popular/3day/json/3/data.js"
    ];

var HypemCrawler = function () {

    /**
     * Get all songs from the current popular list with their streaming urls.
     *
     * @param {Function}[callback] callback function
     * @param {Error} callback.err null if no error occurred
     * @param {object} callback.songs the current songs (key: chart position; value: song)
     */
    function resolvePopularList(callback) {
        async.waterfall([
            function (done) {
                loadPopularSongsFromHypem(done);
            },
            function (done) {
                resolvePopularSongsUrl(done);
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
        resolvePopularList: resolvePopularList
    };
};

module.exports = new HypemCrawler();

function loadPopularSongsFromHypem(done) {
    async.each(hypemPopularLinks, function (link, done) {
        var pathname = url.parse(link).pathname; // '/playlist/popular/3day/json/1/data.js'
        var offsetLink = pathname.split('/')[5]; // '1'
        var offset = 20 * (offsetLink - 1);

        var options = {
            method: "GET",
            url: link
        };

        request(options, function (error, response) {
            if (!error && response.statusCode === 200) {
                var hypemSongs = JSON.parse(response.body);
                _.forIn(hypemSongs, function (hypemSong, num) {
                    if (_.isObject(hypemSong)) {
                        var position = parseInt(num) + offset + 1; // we start at 1 not 0
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

function resolvePopularSongsUrl(done) {
    async.each(popularHypemSongs, function (song, done) {
        hypemResolver.getById(song.mediaid, function (err, url) {
            song.streamUrl = url;
            if (isSoundcloudUrl(url)) {
                song.soundcloudUrl = url;
            }
            done();
        });
    }, function (err) {
        if (err) {
            console.error("Error resolving stream url for popular songs. " + err);
            done(err);
            return;
        }
        done();
    });
}

function isSoundcloudUrl(songUrl) {
    return songUrl !== "http://soundcloud.com/not/found" &&
        songUrl !== "https://soundcloud.com/not/found";
}
