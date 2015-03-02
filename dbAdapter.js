/**
 * Created by Fabian on 29.09.2014.
 *
 * Persists PopularSongDTO in MongoDB
 * Adds current date for further data analysis
 */
var dotenv = require('dotenv');
dotenv.load();

var db = require('monk')(process.env.MONGOLAB_URI);

// TODO abfangen wenn kein eintrag gefunden wird

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
    console.log("Get popular songs");
    // get the latest entry
    popularSongCollection.find(
        {},
        {limit: 1, sort: {_id:-1}},
        function (err, doc) {
            if (err) {
                console.error("Latest record not found. " + err);
                callback(null);
            } else {
                console.info("Latest record found");
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

