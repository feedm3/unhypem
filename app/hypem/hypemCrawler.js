/**
 * @author Fabian Dietenberger
 */

'use strict';

var request = require('request'),
    async = require('async'),
    url = require('url'),
    _ = require('lodash'),
    hypemResolver = require('hypem-resolver');

var popularHypemSongs = {};

var HypemCrawler = function () {

    function resolvePopularList(callback) {

        var hypemPopularLinks = [];
        hypemPopularLinks.push("http://hypem.com/playlist/popular/3day/json/1/data.js");
        hypemPopularLinks.push("http://hypem.com/playlist/popular/3day/json/2/data.js");
        hypemPopularLinks.push("http://hypem.com/playlist/popular/3day/json/3/data.js");

        async.each(hypemPopularLinks, function (link, callback) {
            loadPopularSongsFromHypem(link, callback);
        }, function (err) {
            if (err) {
                console.error("Could not parse popular songs object form hypem");
                throw err;
            }
            console.log("Everything parsed");
            callback(popularHypemSongs);
        });

    }

    return {
        resolvePopularList: resolvePopularList
    };
};

module.exports = new HypemCrawler();

function loadPopularSongsFromHypem(urlToJSON, callback) {
    var pathname = url.parse(urlToJSON).pathname; // '/playlist/popular/3day/json/1/data.js'
    var offsetLink = pathname.split('/')[5]; // '1'
    var offset = 20 * (offsetLink - 1);

    var options = {method: "GET", url: urlToJSON};

    request(options, function (error, response) {
        if (!error && response.statusCode === 200) {
            var hypemSongs = JSON.parse(response.body);
            _.forIn(hypemSongs, function (hypemSong, num) {
                if (_.isObject(hypemSong)) {
                    var position = parseInt(num) + offset + 1; // we start at 1 not 0
                    popularHypemSongs[position] = hypemSong;
                }
            });
            callback();
        }
    });
}
