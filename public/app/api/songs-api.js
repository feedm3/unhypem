/**
 * @author Fabian Dietenberger
 */

'use strict';

import request from 'superagent';

const songsInfo = {
    songs: [],
    timestamp: ''
};
const callbacks = [];

/**
 * Request the popular songs. Requests get cached, so there is only one
 * request.
 *
 * @private
 * @param {Function}[done] gets called when all properties are set
 */
function requestSongs(done) {
    // return songs if they are already requested
    if (songsInfo.songs.length > 0) done();

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
            songsInfo.songs = popular.songs;
            songsInfo.timestamp = popular.timestamp;

            callbacks.forEach(done => done());
            callbacks.length = 0; // clear the array
        });
}

export default function getSongsInfo(callback) {
    requestSongs(function() {
        callback(songsInfo);
    });
}
