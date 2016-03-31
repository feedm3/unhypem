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
     * Select the position of the current song. Put the position (in percent) into the state.
     */
    SELECT_POSITION_IN_PERCENT: 'SELECT_POSITION_IN_PERCENT',

    /**
     * Select the position of the current song. This forces the player to play at the given song. Put the position (in
     * percent) into the state.
     */
    FORCE_POSITION_IN_PERCENT: 'FORCE_POSITION_IN_PERCENT',

    /**
     * Play the current song. No state.
     */
    PLAY: 'PLAY_SONG',

    /**
     * Pause the current song. No state.
     */
    PAUSE: 'PAUSE_SONG',

    /**
     * If the song is playing pause it, if the song is paused play it. No state.
     */
    TOGGLE_PLAY: 'TOGGLE_PLAY',

    /**
     * Play the next song. No state.
     */
    FORWARD: 'NEXT_POSITION',

    /**
     * Play the song from the beginning or select the previous song. No state.
     */
    REWIND: 'PREVIOUS_SONG',

    /**
     * Change the volume of the player. Put the volume (in percent) into the state.
     */
    CHANGE_VOLUME: 'CHANGE_VOLUME',

    /**
     * Get the current popular song infos. No state.
     */
    GET_ALL_SONGS: 'GET_ALL_SONGS',

    /**
     * Get the current selected song. No state.
     */
    GET_CURRENT_SONG: 'GET_CURRENT_SONG',

    /**
     * Change the playlist state. The playlist state as state.
     */
    CHANGE_PLAYLIST_STATE: 'CHANGE_PLAYLIST_STATE',

    /**
     * Let the Player repeat the current song. Boolean as state.
     */
    REPEAT_CURRENT_SONG: 'REPEAT_CURRENT_SONG'
};
