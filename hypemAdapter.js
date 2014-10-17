/**
 * Created by Fabian on 29.09.2014.
 *
 * Loads current popular songs from Hypem.com
 * and adds additional Information to every song
 * like soundcloud links
 */

var request = require('request');
var q = require('q');
var queryString = require('querystring');

var popularSongsDTO,
    CLIENT_ID = "a20ebcaf4c7fc8931bfcba9c7557864a"; // Soundcloud Client ID

/**
 * Requests popular songs JSON from hypem then parses and
 * safes every song into an array object popularSongsDTO
 */
exports.updatePopularSongs = function () {
    popularSongsDTO = [];

    // for detecting when finished
    var total = 50;
    var count = 0;

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
            for (var num in hypemSongList) {
                if (!isNaN(num)) {
                    var position = parseInt(num) + offsetInList + 1;
                    var song = {};
                    song.position = position;
                    song.artist = hypemSongList[num].artist;
                    song.title = hypemSongList[num].title;
                    song.h_mediaid = hypemSongList[num].mediaid;
                    song.h_loved_count = hypemSongList[num].loved_count;
                    popularSongsDTO[position - 1] = song;
                    getSoundcloudURL(song);
                }
            }
        } else {
            console.error("Error while loading JSON from hypem: " + urlToJSON);
        }
    });
}

function getSoundcloudURL(song) {
    var url = "http://hypem.com/go/sc/" + song.h_mediaid,
        options = {method: "HEAD", followRedirect: false, url: url};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 302) {
            var soundcloudUrl = response.headers.location;
            if (soundcloudUrl == "http://soundcloud.com/not/found" || soundcloudUrl == "https://soundcloud.com/not/found") {
                getHypemKey(song);
            } else {
                song.s_url = response.headers.location;
                resolveSoundcloudURL(song);
            }
        } else {
            console.error("Error with head request to:" + url);
        }
    })
}

var cookie = "__utma=1717032.393072307.1385723530.1413031295.1413042377.130; __utmz=1717032.1411373803.101.4.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __qca=P0-1192099176-1385723530317; hblid=fYaYEQ1S27S34nfX2t6JN4W3JOFC0CDj; olfsk=olfsk00024760656742828235; __gads=ID=f437c883a9450f76:T=1398362427:S=ALNI_MZpJh3KfFJKxg7lAgkIujTTrdzhYA; __utmc=1717032; AUTH=03%3A406b2fe38a1ab80a2953869a475ff110%3A1412624464%3A1469267065%3A01-DE; wcsid=AVCmxVsZgg50spdM2t6JNhQQNMDFDPDp; _oklv=1413046019807%2CAVCmxVsZgg50spdM2t6JNhQQNMDFDPDp; _ok=8642-858-10-6552; __utmb=1717032.4.10.1413042377; _okbk=cd4%3Dtrue%2Cvi5%3D0%2Cvi4%3D1413042399509%2Cvi3%3Dactive%2Cvi2%3Dfalse%2Cvi1%3Dfalse%2Ccd8%3Dchat%2Ccd6%3D0%2Ccd5%3Daway%2Ccd3%3Dfalse%2Ccd2%3D0%2Ccd1%3D0%2C; __utmt=1 Connection: keep-alive";
function getHypemKey(song) {
    var options = {method: "GET", url: "", headers: {"Cookie": cookie}};
    var url = "http://hypem.com/track/" + song.h_mediaid;
    options.url = url;
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = body.split('\n');
            for (var num in body) {
                var key;
                if (String(body[num]).indexOf('key') != -1) {
                    // first strike should be the correct one
                    // fix if hypem changes that
                    try {
                        key = JSON.parse(body[num].replace('</script>', '')).tracks[0].key;
                        var hypemUrl = "http://hypem.com/serve/source/" + song.h_mediaid + "/" + key;
                        getMP3(hypemUrl, song);
                    } catch(e) {

                    }
                }
            }
        } else {
            console.error("Getting key not worked for track http://hypem.com/track/" + song.h_mediaid);
        }
    })
}

function getMP3(hypemLink, song) {
    var options = {method: "GET", url: hypemLink, headers: {"Cookie": cookie}};
    request(options, function (error, response, body) {
        if (!error) {
            if (response.statusCode == 200) {
                // the request got a json from hypem
                // where the link to the mp3 file is saved
                var jsonBody = JSON.parse(body);
                song.s_mp3 = jsonBody.url;
            } else {
                console.error("Error resolve MP3 for " + hypemLink + " StatusCode: " + response.statusCode);
            }
        } else {
            console.error("Error resolve MP3 for " + hypemLink + " Message: " + error.message);
        }
    })

}

function resolveSoundcloudURL(song) {
    var url = "http://api.soundcloud.com/resolve.json?url=" + song.s_url + "&client_id=" + CLIENT_ID,
        options = {method: "GET", url: url};
    request(options, function (error, response, body) {
        if (!error) {
            if (response.statusCode == 200) {
                var soundcloudInfo = JSON.parse(body);
                song.s_stream = soundcloudInfo.uri + "/stream?client_id=" + CLIENT_ID;
                song.s_id = soundcloudInfo.id;
                getSoundcloudMP3(song);
            } else {
                console.error("Error resolve soundcloud Stream: " + song.s_url + " StatusCode: " + response.statusCode);
            }
        } else {
            console.error("Error resolve soundcloud Stream: " + song.s_url + " Message: " + error.message);
        }
    })
}

function getSoundcloudMP3(song) {
    var url = song.s_stream,
        options = {method: "HEAD", followRedirect: false, url: url};
    request(options, function (error, response, body) {
        if (!error) {
            // if you request the stream url
            // you get the redirected to the mp3 file
            if (response.statusCode == 302) {
                song.s_mp3 = response.headers.location;
            } else {
                console.error("Error getting MP3 from soundcloud: " + song.s_url + " StatusCode: " + response.statusCode);
                console.log("Now trying to get link via hypem api key...");
                song.s_stream = "http://api.soundcloud.com/tracks/" + song.s_id + "/stream?consumer_key=nH8p0jYOkoVEZgJukRlG6w";
                getSoundcloudMP3(song);
            }
        } else {
            console.error("Error getting MP3 from soundcloud: " + song.s_url + " Message: " + error.message);
        }
    })
}