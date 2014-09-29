var request = require('request');

var popularSongs = [],
CLIENT_ID = "a20ebcaf4c7fc8931bfcba9c7557864a"; // Soundcloud Client ID

exports.updatePopularSongs = function () {
    popularSongs = [];

    requestSongsFromHypem("http://hypem.com/playlist/popular/3day/json/1/data.js", 0);
    requestSongsFromHypem("http://hypem.com/playlist/popular/3day/json/2/data.js", 20);
    requestSongsFromHypem("http://hypem.com/playlist/popular/3day/json/3/data.js", 40);

    setTimeout(function () {
        console.log("Updated songs after 3sec: " + popularSongs.length)
    }, 3000);
};

exports.getPopularSongs = function () {
    return popularSongs;
};

function requestSongsFromHypem(link, offSetInList) {
    var options = {method: "GET", url: link};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var hypemSongList = JSON.parse(body);
            for (var key in hypemSongList) {
                if (!isNaN(key)) {
                    var num = parseInt(key) + offSetInList;
                    var song = {};
                    song.place = num + 1;
                    song.artist = hypemSongList[key].artist;
                    song.title = hypemSongList[key].title;
                    song.h_mediaid = hypemSongList[key].mediaid;
                    song.h_loved_count = hypemSongList[key].loved_count;
                    popularSongs[num] = song;
                    getSoundcloudURL(num);
                }
            }
        } else {
            console.log("Error while loading JSON from hypem: " + link);
        }
    });

}

function getSoundcloudURL(keyInPopularSongs) {
    var url = "http://hypem.com/go/sc/" + popularSongs[keyInPopularSongs].h_mediaid,
    options = {method: "HEAD", followRedirect: false, url: url};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 302) {
            popularSongs[keyInPopularSongs].s_url = response.headers.location;
            resolveSoundcloudURL(keyInPopularSongs);
        } else {
            console.log("Error getting soundcloud URL: " + 'http://hypem.com/go/sc/' + popularSongs[keyInPopularSongs].h_mediaid);
        }
    })
}

function resolveSoundcloudURL(keyInPopularSongs) {
    var url = "http://api.soundcloud.com/resolve.json?url=" + popularSongs[keyInPopularSongs].s_url + "&client_id=" + CLIENT_ID,
    options = {method: "GET", url: url};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var soundcloudInfo = JSON.parse(body);
            popularSongs[keyInPopularSongs].s_stream = soundcloudInfo.uri + "/stream?client_id=" + CLIENT_ID;
            popularSongs[keyInPopularSongs].s_id = soundcloudInfo.id;
            getSoundcloudMP3(keyInPopularSongs);
        } else {
            console.log("Error resolve soundcloud Stream: " + popularSongs[keyInPopularSongs].s_url);
        }
    })
}

function getSoundcloudMP3(keyInPopularSongs) {
    var url = popularSongs[keyInPopularSongs].s_stream,
    options = {method: "HEAD", followRedirect: false, url: url};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 302) {
            popularSongs[keyInPopularSongs].s_mp3 = response.headers.location;
        } else {
            console.log("Error resolve soundcloud MP3: " + popularSongs[keyInPopularSongs].s_url);
        }
    })
}