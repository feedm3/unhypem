/**
 * Created by Fabian on 29.09.2014.
 *
 * Persists PopularSongDTO in MongoDB
 * Adds current date for further data analysis
 */

var monk = require('monk');
var db = monk('localhost:27017/unhypem');

exports.savePopularSongs = function (popularSongsDTO) {
    // save popular songs + date

};

exports.getPopularSongs = function (date) {
    var popularSongsDTO;
    var date = new Date().getTime();


    return popularSongsDTO;
    // get popular songs from the nearest given date
};

exports.getSong = function(mediaId) {
    // get a single song
};

exports.insertSong = function(song){
    // insert a single song
};

exports.isSongInDb = function(mediaId) {
    // check if song exisits in database
    return false;
};

