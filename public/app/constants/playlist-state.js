/**
 * This file defines the playlist state (what to play next).
 *
 * @author Fabian Dietenberger
 */

'use strict';

export default {

    /**
     * Play the next song in the charts. This is the standard playing order.
     */
    NEXT_POSITION: 'NEXT_POSITION',

    /**
     * Play a random next song.
     */
    SHUFFLE_NEXT_SONG: 'SHUFFLE_NEXT_SONG'
};
