/**
 * @author Fabian Dietenberger
 */

'use strict';

import { SoundManager } from 'soundmanager2';
import _ from 'lodash';
import getSongs from '../api/songs-api';

class Player {
    constructor() {
        this.onDurationLoadedCallbacks = [];
        this.onProgressCallbacks = [];
        this.currentSongId = '';
        this.soundManager = new SoundManager();
        this.smSound = null; // soundManager creates a smSound for every song. this object holds the playing smSound

        this.soundManager.setup({
            url: '/swfs/',
            flashVersion: 9,
            useFlashBlock: false,
            useHighPerformance: true,
            wmode: 'transparent',
            waitForWindowLoad: true,
            debugMode: false,
            onready: () => {
                getSongs((songs) => {
                    this.preloadSongs(songs);
                });
            }
        });
    }

    preloadSongs(songs) {
        _.forEach(songs, (song) => {
            if (!_.isString(song.streamUrl)) {
                return;
            }
            this.soundManager.createSound({
                url: song.streamUrl,
                id: song.id,
                stream: true,
                onload: () => {
                    /**
                     * readyState
                     * 0 = uninitialised
                     * 1 = loading
                     * 2 = failed/error
                     * 3 = loaded/success
                     */
                    if (this.smSound.readyState === 3) {
                        const seconds = parseInt(this.smSound.duration / 1000, 10);
                        this.onDurationLoadedCallbacks.forEach(c => c(seconds));
                    }
                },
                whileplaying: () => {
                    if (this.onProgressCallbacks) {
                        const millis = this.smSound.position;
                        this.onProgressCallbacks.forEach(c => c(millis));
                    }
                },
                onfinish: () => {
                    console.log('Song finished.');
                }
            });
        });
    }

    play(songId) {
        // If same ID wants to be played, just pause the song
        if (this.currentSongId === songId) {
            this.smSound.togglePause();
        } else {
            // If new song wants to be played
            // reset the previous so it doesn't start
            // playing in the last position if restarted
            this.currentSongId = songId;
            if (this.smSound) {
                this.smSound.stop();
            }
            this.smSound = this.soundManager.getSoundById(songId);
            this.smSound.play();
        }
    }

    getPositionInSeconds() {
        return this.smSound.position / 1000;
    }

    setPositionInPercent(percent) {
        this.smSound.setPosition(this.smSound.duration / 100 * percent);
    }

    isPlaying() {
        return !this.smSound.paused;
    }

    stop(songId) {
        this.soundManager.stop(songId);
    }

    setVolume(percent = 100) {
        this.soundManager.setVolume(percent);
    }

    /**
     * Get notified when the duration of the song is loaded.
     *
     * @param callback the callback which gets called with the duration in seconds
     */
    registerDurationLoadedCallback(callback) {
        this.onDurationLoadedCallbacks.push(callback);
    }

    /**
     * Get notified when the position changes while the song plays.
     *
     * @param callback the callback which gets called with the current position in millis
     */
    registerOnProgressCallback(callback) {
        this.onProgressCallbacks.push(callback);
    }
}

const player = new Player();
player.soundManager.onready(() => {
    getSongs((songs) => {
        player.preloadSongs(songs);
    });
});

export default new Player();
