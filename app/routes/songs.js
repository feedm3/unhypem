/**
 * @author Fabian Dietenberger
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    Songs = require('../model/songs').Songs;

router.get('/:hypemMediaId', function (req, res) {
    var hypemMediaId = req.params.hypemMediaId;
    Songs.findOne({hypemMediaId: hypemMediaId})
        .exec(function (err, song) {
            if (err) {
                console.error("Error finding song. " + err);
                throw err;
            }
            if (!song) {
                res.sendStatus(404);
                return;
            }
            var songObject = song.toObject();
            songObject.hypemLovedCount = _.last(songObject.hypemLovedCount).count;
            delete songObject._id;
            delete songObject.__v;
            res.json(songObject);
        });
});

module.exports = router;
