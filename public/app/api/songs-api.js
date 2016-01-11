/**
 * @author Fabian Dietenberger
 */

'use strict';

import request from 'superagent';

let songs = [];
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

    request.get('http://localhost:3000/popular')
        .end((err, response) => {
            if (err) throw err;

            const popular = JSON.parse(response.text);
            songs = popular.songs;

            callbacks.forEach(done => done());
            callbacks = [];
        });
}

export default function getSongs(callback) {
    requestSongs(function() {
        callback(songs);
    });
}
