/**
 * @author Fabian Dietenberger
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    util = require('../util'),
    SongsModel = require('../model/songs-model');

router.get('/:hypemMediaId', function (req, res) {
    var hypemMediaId = req.params.hypemMediaId;

    SongsModel
        .forge()
        .where({
            hypemMediaId: hypemMediaId
        })
        .fetch()
        .then(function (song) {
            if (!song) {
                res.sendStatus(404);
                return;
            }

            if (util.isSoundcloudUrl(song.streamUrl)) {
                song.streamUrl += "?client_id=" + process.env.SOUNDCLOUD_CLIENT_ID;
            }
            res.json(song.toJSON());
        });
});

module.exports = router;
