/**
 * @author Fabian Dietenberger
 */

'use strict';

import getSongs from '../api/songs-api';
import Player from '../player/player';
import ACTION from '../constants/action';

const songs = [];
const currentSong = {
    song: {},
    state: {},
    position: 0
};
const onAllSongsUpdateCallbacks = []; // get called once when popular songs arrive
const onCurrentSongUpdateCallbacks = []; // gets called every time the song, position or state of the song changes

const SongDispatcher = {

    init: () => {
        getSongs((popularSongs) => {
            songs.push(...popularSongs);
            Player.preloadSongs(songs);
        });
    },

    dispatch: (action, state) => {
        switch (action) {
            case ACTION.SELECT_SONG:
                break;
            case ACTION.SELECT_POSITION:
                break;
            case ACTION.PLAY:
                break;
            case ACTION.PAUSE:
                break;
            case ACTION.REWIND:
                break;
            case ACTION.FORWARD:
                break;
            case ACTION.CHANGE_VOLUME:
                Player.setVolume(state);
                break;
        }
    },

    notifyAllSongsUpdate: () => {
        onAllSongsUpdateCallbacks.forEach((callback) => {
            callback(songs);
        });
    },

    notifyCurrentSongUpdate: () => {
        onCurrentSongUpdateCallbacks.forEach((callback) => {
            callback(currentSong);
        });
    },

    registerOnAllSongsUpdate: (id, callback) => {
        onAllSongsUpdateCallbacks.push({id, callback});
    },

    removeOnALlSongsUpdate: (id) => {
        onAllSongsUpdateCallbacks.forEach(callback => {
            if (callback.id === id) {
                onAllSongsUpdateCallbacks.splice(onAllSongsUpdateCallbacks.indexOf(callback), 1);
            }
        });
    },

    registerOnCurrentSongUpdate: (id, callback) => {
        onCurrentSongUpdateCallbacks.push({id, callback});
    },

    removeOnCurrentSongUpdate: (id) => {
        onCurrentSongUpdateCallbacks.forEach(callback => {
            if (callback.id === id) {
                onCurrentSongUpdateCallbacks.splice(onCurrentSongUpdateCallbacks.indexOf(callback), 1);
            }
        });
    }
};
SongDispatcher.init();

export default SongDispatcher;
