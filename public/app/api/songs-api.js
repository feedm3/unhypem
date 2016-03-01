/**
 * @author Fabian Dietenberger
 */

'use strict';

import request from 'superagent';

let songs = [];
let timestamp = '';
let callbacks = [];

/**
 * Request the popular songs. Requests get cached, so there is only one
 * request.
 *
 * @private
 * @param {Function}[done] gets called when all properties are set
 */
function requestSongs(done) {
    // return songs if they are already requested
    if (songs.length > 0) done();

    // cache the done callback and only continue if this is the first execution
    callbacks.push(done);
    if (callbacks.length >= 2) return;

    // in production the host is the same as the page but in development mode the host is
    // on a different port
    let host = '/';
    if (window.location.hostname === 'localhost') {
        host = 'http://localhost:3000/';
    }

    request.get(host + 'popular')
        .end((err, response) => {
            if (err) throw err;

            const popular = JSON.parse(response.text);
            songs = popular.songs;
            timestamp = popular.timestamp;

            callbacks.forEach(done => done());
            callbacks = [];
        });
}

function requestSongsAndTimestamp(done) {
    if (timestamp === '') {
        requestSongs(() => {
            done({timestamp, songs});
        });
    }
}

export default function getSongs(callback) {
    requestSongs(function() {
        callback(songs);
    });
}

export function getSongsAndTimestamp(callback) {
    requestSongsAndTimestamp(callback);
}
