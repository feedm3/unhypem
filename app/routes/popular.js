/**
 * @author Fabian Dietenberger
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    Charts = require('../model/charts').Charts;

/**
 * GET the latest popular songs.
 * The timestamp of the popular songs gets written into
 * the header field 'timestamp'.
 */
router.get('/', function (req, res) {
    Charts.findOne()
        .sort({timestamp: -1})
        .populate('songs.song')
        .exec(function (err, charts) {
            var popularSongs = {};
            _.forEach(charts.songs, function (songAndPosition) {
                var position = songAndPosition.position;
                var song = songAndPosition.song.toObject();
                delete song._id;
                delete song.__v;
                popularSongs[position] = song;
            });

            res.header('timestamp', charts.timestamp);
            res.json(popularSongs);
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
