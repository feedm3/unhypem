/**
 * @author Fabian Dietenberger
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChartSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        index: true,
        default: 'popular'
    },
    timestamp: {
        type: Date,
        required: true,
        index: true
    },
    songs: [{
        position: Number,
        song: {
            type: Schema.Types.ObjectId,
            ref: 'songs'
        }
    }]
});

var Charts = mongoose.model('charts', ChartSchema);

Charts.schema.path('type').validate(function (value) {
    return /popular|remix-only|no-remix/.test(value);
}, 'Invalid input. Type must be \'popular\', \'remix-only\' or \'no-remix\'');

module.exports = {
    Charts: Charts
};
 
