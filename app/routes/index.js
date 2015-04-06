var express = require('express');
var router = express.Router();
var dbAdapter = require('../database/dbAdapter');

// THIS FILE IS NOT USED!!


/* GET home page. */
router.get('/', function (req, res) {
    dbAdapter.getPopularSongs(function(latestEntry) {
        var date = latestEntry._id;
        console.log(date);
        res.render('index', {"popularSongsDTO": latestEntry.songs, "date":date});
    });
});

function getTimestampById(id) {
    id = id.toString();
    // first 4 bytes are the timestamp portion (8 hex chars)
    var timehex = id.substring(0, 8);
    console.log(timehex); // gives: 4f94c2a1

    // convert to a number... base 16
    var secondsSinceEpoch = parseInt(timehex, 16);
    console.log(secondsSinceEpoch); // gives: 1335149217

    // convert to milliseconds, and create a new date
    var dt = new Date(secondsSinceEpoch * 1000);
    return dt;
}

module.exports = router;
