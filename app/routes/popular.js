/**
 * @author Fabian Dietenberger
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    logger = require('winston'),
    _ = require('lodash'),
    util = require('../util'),
    Charts = require('../model/charts').Charts;

/**
 * GET the latest popular songs.
 * The timestamp of the popular songs gets written into
 * the header field 'timestamp'.
 */
router.get('/', function (req, res) {
    logger.info("Popular route requested");
    Charts.find()
        .sort({timestamp: -1})
        .limit(1)
        .populate('songs.song')
        .exec(function (err, charts) {
            logger.info("Popular songs found");
            if (err) {
                logger.error("Could not find popular songs in database. " + err);
                throw err;
            }
            // TODO fdi refactor
            if (charts[0]) {
                var popularSongs = {};
                _.forEach(charts[0].songs, function (songAndPosition) {
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
                logger.info("Popular songs sent");
                res.json(popularSongs);
            } else {
                res.sendStatus(404);
            }
        });
});

module.exports = router;
