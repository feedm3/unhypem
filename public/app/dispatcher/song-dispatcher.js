/**
 * @author Fabian Dietenberger
 */

'use strict';

import getSongsInfo from '../api/songs-api';
import Player from '../player/player';
import ACTION from '../constants/action';
import SONG_STATE from '../constants/song-state';

const songsInfo = {
    songs: [],
    timestamp: ''
};
const currentSongInfo = {
    song: {},
    state: SONG_STATE.PAUSED,
    positionUpdate: false,
    positionUpdatePosition: 0,
    position: 0
};
const onAllSongsUpdateCallbacks = []; // get called once when popular songs arrive
const onCurrentSongUpdateCallbacks = []; // gets called every time the song, position or state of the song changes

const SongDispatcher = {

    init() {
        getSongsInfo((popularSongsInfo) => {
            songsInfo.songs.push(...popularSongsInfo.songs);
            songsInfo.timestamp = popularSongsInfo.timestamp;

            currentSongInfo.song = popularSongsInfo.songs[0];

            this.notifyAllSongsUpdate(); // TODO may cause race condition if components are not loaded
            this.notifyCurrentSongUpdate();
        });
    },

    dispatch(action, state) {
        let currentIndex;
        switch (action) {
            case ACTION.SELECT_SONG:
                currentSongInfo.song = state;
                currentSongInfo.position = 0;
                this.notifyCurrentSongUpdate();
                break;
            case ACTION.SELECT_POSITION_IN_PERCENT:
                currentSongInfo.position = state;
                this.notifyCurrentSongUpdate();
                break;
            case ACTION.FORCE_POSITION_IN_PERCENT:
                currentSongInfo.positionUpdatePosition = state;
                currentSongInfo.positionUpdate = true;
                this.notifyCurrentSongUpdate();
                break;
            case ACTION.PLAY:
                currentSongInfo.state = SONG_STATE.PLAYING;
                this.notifyCurrentSongUpdate();
                break;
            case ACTION.PAUSE:
                currentSongInfo.state = SONG_STATE.PAUSED;
                this.notifyCurrentSongUpdate();
                break;
            case ACTION.TOGGLE_PLAY:
                if (currentSongInfo.state === SONG_STATE.PLAYING) {
                    currentSongInfo.state = SONG_STATE.PAUSED;
                } else {
                    currentSongInfo.state = SONG_STATE.PLAYING;
                }
                this.notifyCurrentSongUpdate();
                break;
            case ACTION.REWIND:
                currentIndex = this.getIndexOfCurrentSong();
                currentIndex = currentIndex === 0 ? 49 : currentIndex - 1;
                this.dispatch(ACTION.SELECT_SONG, songsInfo.songs[currentIndex]);
                break;
            case ACTION.FORWARD:
                currentIndex = this.getIndexOfCurrentSong();
                currentIndex = currentIndex === 49 ? 0 : currentIndex + 1;
                this.dispatch(ACTION.SELECT_SONG, songsInfo.songs[currentIndex]);
                break;
            case ACTION.CHANGE_VOLUME:
                Player.setVolume(state);
                break;
            case ACTION.GET_ALL_SONGS:
                this.notifyAllSongsUpdate();
                break;
        }
    },

    notifyAllSongsUpdate() {
        onAllSongsUpdateCallbacks.forEach(callbackComponent => {
            callbackComponent.callback(songsInfo);
        });
    },

    notifyCurrentSongUpdate() {
        onCurrentSongUpdateCallbacks.forEach(callbackComponent => {
            callbackComponent.callback(currentSongInfo);
        });
    },

    registerOnAllSongsUpdate(id, callback) {
        this.checkCallbackArgument(id, callback);
        onAllSongsUpdateCallbacks.push({id, callback});
    },

    removeOnALlSongsUpdate(id) {
        onAllSongsUpdateCallbacks.forEach(callback => {
            if (callback.id === id) {
                onAllSongsUpdateCallbacks.splice(onAllSongsUpdateCallbacks.indexOf(callback), 1);
            }
        });
    },

    registerOnCurrentSongUpdate(id, callback) {
        this.checkCallbackArgument(id, callback);
        onCurrentSongUpdateCallbacks.push({id, callback});
    },

    removeOnCurrentSongUpdate(id) {
        onCurrentSongUpdateCallbacks.forEach(callback => {
            if (callback.id === id) {
                onCurrentSongUpdateCallbacks.splice(onCurrentSongUpdateCallbacks.indexOf(callback), 1);
            }
        });
    },

    getIndexOfCurrentSong() {
        return songsInfo.songs.map(song => song.id).indexOf(currentSongInfo.song.id);
    },

    checkCallbackArgument(id, callback) {
        if (typeof id !== 'string') {
            throw new Error('id must be a string');
        }
        if (callback === null) {
            throw new Error('callback must not be null');
        }
    }
};
SongDispatcher.init();

export default SongDispatcher;
