/**
 * @author Fabian Dietenberger
 */

'use strict';

import SongsModel from '../model/songs-model';

var express = require('express'),
    router = express.Router(),
    util = require('../util');

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
