/**
 * @author Fabian Dietenberger
 */

'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    util = require('../util');

var SongSchema = mongoose.Schema({
    artist: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    hypemMediaId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    hypemLovedCount: [{
        timestamp: Date,
        count: Number
    }],
    streamUrl: String,
    soundcloudUrl: String, // without ?client_id=YOUR_CLIENT_ID
    soundcloudId: String,
    waveformUrl: String
});

var Songs = mongoose.model('songs', SongSchema);

module.exports = {
    Songs: Songs
};

function appendSoundcloudClientId(song) {
    if (util.isSoundcloudUrl(song.streamUrl)) {
        song.streamUrl += "?client_id=" + process.env.SOUNDCLOUD_CLIENT_ID;
    }
}