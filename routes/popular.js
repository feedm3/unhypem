var express = require('express');
var dbAdapter = require('./../dbAdapter');
var router = express.Router();

/**
 * GET the latest popular songs.
 * The timestamp of the popular songs gets written into
 * the header field 'timestamp'.
 */
router.get('/', function (req, res) {
    dbAdapter.getPopularSongs(function (latestEntry) {
        var objectId = latestEntry._id;
        res.header('timestamp', dateFromObjectId(objectId));
        res.json(latestEntry.songs);
    });
});

/**
 * Convert an object ID to a date.
 *
 * @param objectId the object id to convert
 * @returns {Date} the date
 */
function dateFromObjectId(objectId) {
    return new Date(parseInt(objectId.toString().substring(0, 8), 16) * 1000);
}

module.exports = router;
