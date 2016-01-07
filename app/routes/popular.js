/**
 * @author Fabian Dietenberger
 */

'use strict';

import ChartsModel from '../model/charts-model';

const express = require('express');
const router = express.Router();
const logger = require('winston');
const util = require('../util');
const _ = require('lodash');

/**
 * GET the latest popular songs.
 */
router.get('/', function(req, res) {
    logger.info('Popular route requested');
    ChartsModel
        .forge()
        .latest()
        .fetch({
            withRelated: [
                {
                    songs: function(query) {
                        query.orderBy('position');
                    }
                }
            ]
        })
        .then(function(chart) {
            const result = chart.toJSON();
            _.forEach(result.songs, function(song) {
                song.position = song._pivot_position;
                // TODO add soundcloud api
                appendSoundcloudClientId(song);
                delete song._pivot_chart_id;
                delete song._pivot_song_id;
                delete song._pivot_position;
            });

            delete result.id;

            res.json(result);
        }).catch(function(err) {
            throw err;
        });
});

module.exports = router;

function appendSoundcloudClientId(song) { // Todo put in model
    if (util.isSoundcloudUrl(song.streamUrl)) {
        song.streamUrl += '?client_id=' + process.env.SOUNDCLOUD_CLIENT_ID;
    }
}
