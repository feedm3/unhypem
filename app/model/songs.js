var mongoose = require('mongoose');

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
    hypemLovedCount: Number,
    streamUrl: String,
    soundcloudUrl: String,
    soundcloudId: String,
    waveformUrl: String
});

var Songs = mongoose.model('songs', SongSchema);

module.exports = {
    Songs: Songs
};