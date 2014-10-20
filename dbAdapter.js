/**
 * Created by Fabian on 29.09.2014.
 *
 * Persists PopularSongDTO in MongoDB
 * Adds current date for further data analysis
 */

var monk = require('monk');
var db = monk('localhost:27017/unhypem');


exports.savePopularSongs = function (popularSongsDTO) {
    var popularSongCollection = db.get('popularSongs');
    var newDBEntry = {"songs": popularSongsDTO};

    popularSongCollection.insert(newDBEntry, function(err, doc) {
        if (err) {
            console.error("Popular songs not inserted into database. " + err);
        } else {
            console.log("Popular songs inserted into database.");
        }
    });

};

exports.getPopularSongs = function (callback) {
    var popularSongCollection = db.get('popularSongs');
    // get the latest entry
    popularSongCollection.find(
        {},
        {limit: 1, sort: {_id:-1}},
        function (err, doc) {
            if (err) {
                console.error("Latest record not found. " + err);
                callback(null);;
            } else {
                console.log("Latest record found");
                callback(doc[0]);
            }
    });
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

