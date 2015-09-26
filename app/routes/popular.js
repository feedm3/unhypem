/**
 * @author Fabian Dietenberger
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    util = require('../util'),
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
            if (err) {
                console.error("Could not find popular songs in database. " + err);
                throw err;
            }
            if (charts) {
                var popularSongs = {};
                _.forEach(charts.songs, function (songAndPosition) {
                    var position = songAndPosition.position;
                    var song = songAndPosition.song.toObject();
                    song.hypemLovedCount = _.last(song.hypemLovedCount).count;
                    if (util.isSoundcloudUrl(song.streamUrl)) {
                        song.streamUrl += "?client_id=" + process.env.SOUNDCLOUD_CLIENT_ID;
                    }
                    delete song._id;
                    delete song.__v;
                    popularSongs[position] = song;
                });

                res.header('timestamp', charts.timestamp);
                res.json(popularSongs);
            } else {
                res.sendStatus(404);
            }
        });
});

module.exports = router;
