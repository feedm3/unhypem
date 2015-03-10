/**
 * Created by Fabian on 29.09.2014.
 *
 * Loads current popular songs from Hypem.com
 * and adds additional Information to every song
 * like soundcloud links
 */

var request = require('request');
var dbAdapter = require('./dbAdapter');
var songModel = require('./model/song');
var q = require('q');
var queryString = require('querystring');

var CLIENT_ID = "a20ebcaf4c7fc8931bfcba9c7557864a", // Soundcloud Client ID
    SONGS_TO_CRAWL = 50,
    COOKIE = "__utma=1717032.393072307.1385723530.1413915594.1413918197.143; __utmz=1717032.1411373803.101.4.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __qca=P0-1192099176-1385723530317; hblid=fYaYEQ1S27S34nfX2t6JN4W3JOFC0CDj; olfsk=olfsk00024760656742828235; __gads=ID=f437c883a9450f76:T=1398362427:S=ALNI_MZpJh3KfFJKxg7lAgkIujTTrdzhYA; AUTH=03%3A406b2fe38a1ab80a2953869a475ff110%3A1412624464%3A1469266248%3A01-DE; __utmb=1717032.3.10.1413918197; __utmc=1717032; __utmt=1";


var popularList,
    songsCrawled = 0, // +1 for every crawled song; if 50 then crawling is finished
    lock = false,
    onCrawlingFinishedCallback;

//FIXME error get not caught with finish()
/**
 * Requests popular songs JSON from hypem then parses and
 * safes every song into an array object popularSongsDTO
 */
exports.updatePopularSongs = function (callback) {
    onCrawlingFinishedCallback = callback;
    popularList = {};

    if (lock) {
        return "locked"; // TODO if cronjob detects a long running lock, do something
    } else {
        lock = true;
        getSongsFromHypem("http://hypem.com/playlist/popular/3day/json/1/data.js", 0);
        getSongsFromHypem("http://hypem.com/playlist/popular/3day/json/2/data.js", 20);
        getSongsFromHypem("http://hypem.com/playlist/popular/3day/json/3/data.js", 40);
    }
};

/**
 * Get current songs in DTO. You should run
 * updatePopularSongs() before the method
 *
 * @returns popularList
 */
exports.getPopularSongs = function () {
    return popularList;
};

exports.isLocked = function () {
    return lock;
};

function getSongsFromHypem(urlToJSON, offsetInList) {
    var options = {method: "GET", url: urlToJSON};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var hypemSongList = JSON.parse(body);
            for (var num in hypemSongList) {
                if (!isNaN(num)) {
                    // TODO hier überprüfen ob Song schon in DB
                    var position = parseInt(num) + offsetInList;

                    var song = songModel.createNewSong();
                    song.artist = hypemSongList[num].artist;
                    song.title = hypemSongList[num].title;
                    song.hypemMediaId = hypemSongList[num].mediaid;
                    song.hypemLovedCount = hypemSongList[num].loved_count;

                    popularList[position] = song;

                    getSoundcloudURL(song);
                }
            }
        } else {
            console.error("Error while loading JSON from hypem: " + urlToJSON);
            songsCrawled = songsCrawled + 20;
            finish();
        }
    });
}

function getSoundcloudURL(song) {
    var url = "http://hypem.com/go/sc/" + song.hypemMediaId,
        options = {method: "HEAD", followRedirect: false, url: url};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 302) {
            var soundcloudUrl = response.headers.location;
            if (soundcloudUrl == "http://soundcloud.com/not/found" || soundcloudUrl == "https://soundcloud.com/not/found") {
                getHypemKey(song);
            } else {
                song.soundcloudUrl = soundcloudUrl;
                song.streamUrl = response.headers.location;
                resolveSoundcloudURL(song);
            }
        } else {
            console.error("Error with head request to:" + url);
            finish();
        }
    })
}

function getHypemKey(song) {
    var options = {method: "GET", url: "", headers: {"Cookie": COOKIE}};
    options.url = "http://hypem.com/track/" + song.hypemMediaId;

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
                        var hypemUrl = "http://hypem.com/serve/source/" + song.hypemMediaId + "/" + key;
                        getMP3(hypemUrl, song);
                    } catch(e) {
                        // if error happens here, first check the cookie value (maybe refresh)
                        // if this is not helping, manually check the body of the request for the key value
                    }
                }
            }
        } else {
            console.error("Getting key not worked for track http://hypem.com/track/" + song.hypemMediaId);
            finish();
        }
    })
}

function getMP3(hypemLink, song) {
    var options = {method: "GET", url: hypemLink, headers: {"Cookie": COOKIE}};
    request(options, function (error, response, body) {
        if (!error) {
            if (response.statusCode == 200) {
                // the request got a json from hypem
                // where the link to the mp3 file is saved
                var jsonBody = JSON.parse(body);
                song.streamUrl = jsonBody.url;
                //song.mp3Url = jsonBody.url; // TODO not correct, mp3 url is always the same as stream url
                finish();
            } else {
                console.error("Error resolve MP3 for " + song.artist + " (" + hypemLink + ") StatusCode: " + response.statusCode);
                // TODO überlegen was in so einem Fall gemacht wird
                finish();
            }
        } else {
            console.error("Error resolve MP3 for " + song.artist + "(" + hypemLink + ") Message: " + error.message);
            finish();
        }
    })

}

function resolveSoundcloudURL(song) {
    var url = "http://api.soundcloud.com/resolve.json?url=" + song.soundcloudUrl + "&client_id=" + CLIENT_ID,
        options = {method: "GET", url: url};
    request(options, function (error, response, body) {
        if (!error) {
            if (response.statusCode == 200) {
                var soundcloudInfo = JSON.parse(body);
                song.streamUrl = soundcloudInfo.uri + "/stream?client_id=" + CLIENT_ID;
                song.soundcloudId = soundcloudInfo.id;
                song.waveformUrl = soundcloudInfo.waveform_url;
                getSoundcloudMP3(song);
            } else {
                console.error("Error resolve soundcloud Stream: " + song.s_url + " StatusCode: " + response.statusCode);
                finish();
            }
        } else {
            console.error("Error resolve soundcloud Stream: " + song.s_url + " Message: " + error.message);
            finish();
        }
    })
}

function getSoundcloudMP3(song) {
    var url = song.streamUrl,
        options = {method: "HEAD", followRedirect: false, url: url};
    request(options, function (error, response, body) {
        if (!error) {
            // if you request the stream url
            // you get the redirected to the mp3 file
            if (response.statusCode == 302) {
                //song.mp3Url = response.headers.location;
                finish();
            } else {
                // get stream url with hypem api key
                song.streamUrl = "http://api.soundcloud.com/tracks/" + song.soundcloudId + "/stream?consumer_key=nH8p0jYOkoVEZgJukRlG6w";
                getSoundcloudMP3(song);
            }
        } else {
            console.error("Error getting MP3 from soundcloud: " + song.soundcloudUrl + " Message: " + error.message);
            finish();
        }
    })
}

function finish() {
    songsCrawled++;
    // TODO wenn crawler mehrfach nicht fertig crawlt, im debug modus crawlen und diese ausgabe aktivieren
    //console.log("Finished number " + songsCrawled + ". Lock " + lock + " \r");
    if (songsCrawled == SONGS_TO_CRAWL) {
        lock = false;
        songsCrawled = 0;
        onCrawlingFinishedCallback(popularList);
    }
}