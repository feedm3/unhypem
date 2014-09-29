/**
 * Created by Fabian on 29.09.2014.
 *
 * Loads current popular songs from Hypem.com
 * and adds additional Information to every song
 * like soundcloud links
 */

var request = require('request');

var popularSongsDTO,
    CLIENT_ID = "a20ebcaf4c7fc8931bfcba9c7557864a"; // Soundcloud Client ID

/**
 * Requests popular songs JSON from hypem then parses and
 * safes every song into an array object popularSongsDTO
 */
exports.updatePopularSongs = function () {
    popularSongsDTO = [];

    getSongsFromHypem("http://hypem.com/playlist/popular/3day/json/1/data.js", 0);
    getSongsFromHypem("http://hypem.com/playlist/popular/3day/json/2/data.js", 20);
    getSongsFromHypem("http://hypem.com/playlist/popular/3day/json/3/data.js", 40);
};

/**
 * Get current songs in DTO. You should run
 * updatePopularSongs() before the method
 *
 * @returns popularSongsDTO
 */
exports.getPopularSongs = function () {
    return popularSongsDTO;
};

function getSongsFromHypem(urlToJSON, offsetInList) {
    var options = {method: "GET", url: urlToJSON};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var hypemSongList = JSON.parse(body);
            for (var key in hypemSongList) {
                if (!isNaN(key)) {
                    var song = {};
                    song.position = parseInt(key) + offsetInList + 1;
                    song.artist = hypemSongList[key].artist;
                    song.title = hypemSongList[key].title;
                    song.h_mediaid = hypemSongList[key].mediaid;
                    song.h_loved_count = hypemSongList[key].loved_count;
                    popularSongsDTO[position-1] = song;
                    getSoundcloudURL(song);
                }
            }
        } else {
            console.log("Error while loading JSON from hypem: " + link);
        }
    });
}

function getSoundcloudURL(song) {
    var url = "http://hypem.com/go/sc/" + song.h_mediaid,
        options = {method: "HEAD", followRedirect: false, url: url};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 302) {
            song.s_url = response.headers.location;
            resolveSoundcloudURL(song);
        } else {
            console.log("Error getting soundcloud URL: " + 'http://hypem.com/go/sc/' + song.h_mediaid);
        }
    })
}

function resolveSoundcloudURL(song) {
    var url = "http://api.soundcloud.com/resolve.json?url=" + song.s_url + "&client_id=" + CLIENT_ID,
        options = {method: "GET", url: url};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var soundcloudInfo = JSON.parse(body);
            song.s_stream = soundcloudInfo.uri + "/stream?client_id=" + CLIENT_ID;
            song.s_id = soundcloudInfo.id;
            getSoundcloudMP3(song);
        } else {
            console.log("Error resolve soundcloud Stream: " + song.s_url);
        }
    })
}

function getSoundcloudMP3(song) {
    var url = song.s_stream,
        options = {method: "HEAD", followRedirect: false, url: url};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 302) {
            song.s_mp3 = response.headers.location;
        } else {
            console.log("Error resolve soundcloud MP3: " + song.s_url);
        }
    })
}