/**
 * This file defines the actions which the dispatcher can handle.
 *
 * @author Fabian Dietenberger
 */

'use strict';
 
export default {

    /**
     * Select the current song. Put the song into the state.
     */
    SELECT_SONG: 'SELECT_SONG',

    /**
     * Select the position of the current song. Put the position (in millis) into the state.
     */
    SELECT_POSITION: 'SELECT_POSITION',

    /**
     * Play the current song. Put the position (in millis) into the state.
     */
    PLAY: 'PLAY_SONG',

    /**
     * Pause the current song. No state.
     */
    PAUSE: 'PAUSE_SONG',

    /**
     * Play the next song. No state.
     */
    FORWARD: 'NEXT_SONG',

    /**
     * Play the song from the beginning or select the previous song. No state.
     */
    REWIND: 'PREVIOUS_SONG',

    /**
     * Change the volume of the player. Put the volume (in percent) into the state.
     */
    CHANGE_VOLUME: 'CHANGE_VOLUME'
};
