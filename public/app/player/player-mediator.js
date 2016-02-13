/**
 * This script is used to handle the global songs state.
 *
 * @author Fabian Dietenberger
 */

'use strict';

import getSongs from '../api/songs-api';
import Player from './player';

let songs = null;
let selectedSongPosition = 1;

const onTogglePauseCallbacks = [];
let onSongChangeCallbacks = [];

const SongsManager = {

    init() {
        getSongs((popularSongs) => {
            songs = popularSongs;
        });

        Player.registerOnFinishedCallback(() => {
            this.forward();
        });
    },

    getSongs() {
        return songs;
    },

    getSelectedSong() {
        return songs[selectedSongPosition - 1];
    },

    setSelectedSong(songToSelect) {
        const song = songs.find((song) => {
            return song.id === songToSelect.id;
        });
        selectedSongPosition = song.position;
        onSongChangeCallbacks.forEach(c => c.callback(song));
        Player.load(song.id);
    },

    forward() {
        if (selectedSongPosition === 50) {
            this.setSelectedSong(songs[0]);
        } else {
            this.setSelectedSong(songs[selectedSongPosition]);
        }
        if (this.isPlaying()) {
            this.playSelectedSong();
        }
    },

    rewind() {
        if (Player.getPositionInSeconds() > 5) {
            Player.setPositionInPercent(0);
        } else {
            if (selectedSongPosition === 1) {
                this.setSelectedSong(songs[49]);
            } else {
                this.setSelectedSong(songs[selectedSongPosition - 2]);
            }
            if (this.isPlaying()) {
                this.playSelectedSong();
            }
        }
    },

    isPlaying() {
        return Player.isPlaying();
    },

    playSelectedSong() {
        Player.play(this.getSelectedSong().id);
        onTogglePauseCallbacks.forEach(c => c());
    },

    setPosition(percent) {
        Player.setPositionInPercent(percent);
    },

    getDuration() {
        return Player.getDuration();
    },

    registerOnLoadedCallback(callback) {
        Player.registerOnLoadedCallback(callback);
    },

    registerOnTogglePauseCallback(callback) {
        onTogglePauseCallbacks.push(callback);
    },

    registerOnSongChangeCallback(id, callback) {
        onSongChangeCallbacks.push({id, callback});
    },

    removeOnSongChangeCallback(id) {
        // TODO remove callbacks from destroy components on all arrays
        onSongChangeCallbacks.forEach(storedCallback => {
            if (storedCallback.id === id) {
                onSongChangeCallbacks.splice(onSongChangeCallbacks.indexOf(storedCallback), 1);
            }
        });
    },

    registerOnProgressCallback(callback) {
        Player.registerOnProgressCallback(callback);
    }
};

SongsManager.init();
export default SongsManager;
