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
const onSongChangeCallbacks = [];

getSongs((popularSongs) => {
    songs = popularSongs;
});

const SongsManager = {
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
        onSongChangeCallbacks.forEach(c => c(song));
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
        if (Player.getProgressInSeconds() > 5) {
            Player.setProgressInPercent(0);
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

    registerOnTogglePauseCallback(callback) {
        onTogglePauseCallbacks.push(callback);
    },

    registerOnSongChangeCallback(callback) {
        onSongChangeCallbacks.push(callback);
    },

    registerOnDurationLoadedCallback(callback) {
        Player.registerDurationLoadedCallback(callback);
    }
};

export default SongsManager;
