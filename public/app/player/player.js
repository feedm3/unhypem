/**
 * @author Fabian Dietenberger
 */

'use strict';

import { SoundManager } from 'soundmanager2';
import forEach from 'lodash/forEach';
import isString from 'lodash/isString';
import getSongs from '../api/songs-api';

class Player {
    constructor() {
        this.ID_PREFIX = 'UH_'; // soundmanager2 id needs to start with an non-numeric char
        this.isReady = false;
        this.isSongPlaying = false; // smSound.paused doesn't work correctly so we have to manually keep track of the playing state
        this.onLoadedCallbacks = [];
        this.onProgressCallbacks = [];
        this.onFinishedCallbacks = [];
        this.currentSongId = '';
        this.soundManager = new SoundManager();
        this.smSound = null; // soundManager creates a smSound for every song. this object holds the playing smSound

        this.soundManager.setup({
            flashVersion: 9,
            useFlashBlock: false,
            useHighPerformance: true,
            wmode: 'transparent',
            waitForWindowLoad: true,
            debugMode: false,
            onready: () => {
                this.isReady = true;
                getSongs((songs) => {
                    this.preloadSongs(songs);
                    this.load(songs[0].id);
                });
            }
        });
    }

    preloadSongs(songs) {
        forEach(songs, (song) => {
            if (!isString(song.streamUrl)) {
                return;
            }
            this.soundManager.createSound({
                url: song.streamUrl,
                id: this.ID_PREFIX + song.id,
                stream: true,
                autoPlay: false,
                onload: () => {
                    /**
                     * readyState
                     * 0 = uninitialised
                     * 1 = loading
                     * 2 = failed/error
                     * 3 = loaded/success
                     */
                    if (this.smSound.readyState === 3) {
                        this.smSound = this.soundManager.getSoundById(this.currentSongId);
                        this.onLoadedCallbacks.forEach(c => c());
                    }
                },
                whileplaying: () => {
                    if (this.onProgressCallbacks) {
                        const millis = this.smSound.position;
                        this.onProgressCallbacks.forEach(c => c(millis));
                    }
                },
                onfinish: () => {
                    if (this.onFinishedCallbacks) {
                        this.onFinishedCallbacks.forEach(c => c());
                    }
                }
            });
        });
    }

    load(songId) {
        if (!this.isReady) {
            return;
        }

        songId = this.ID_PREFIX + songId;
        if (this.currentSongId === songId) {
            return;
        }
        this.currentSongId = songId;

        if (this.smSound) {
            this.smSound.stop();
            this.smSound.unload();
        }
        this.smSound = this.soundManager.getSoundById(songId);
        this.soundManager.load(songId);
    }

    play(songId) {
        songId = this.ID_PREFIX + songId;
        // If same ID wants to be played, just pause the song
        if (this.currentSongId === songId) {
            this.smSound.togglePause();
            this.isSongPlaying = !this.smSound.paused;
        } else {
            // If new song wants to be played
            // reset the previous so it doesn't start
            // playing in the last position if restarted
            this.currentSongId = songId;
            if (this.smSound) {
                this.smSound.stop();
                this.smSound.unload();
            }
            this.smSound = this.soundManager.getSoundById(songId);
            this.smSound.play();
            this.isSongPlaying = true;
        }
    }

    getDuration() {
        const seconds = parseInt(this.smSound.duration / 1000, 10);
        return seconds;
    }

    getPositionInSeconds() {
        return this.smSound.position / 1000;
    }

    setPositionInPercent(percent) {
        this.smSound.setPosition(this.smSound.duration / 100 * percent);
    }

    isPlaying() {
        // !this.smSound.paused doesn't work correctly!
        return this.isSongPlaying;
    }

    stop(songId) {
        songId = this.ID_PREFIX + songId;
        this.soundManager.stop(songId);
    }

    setVolume(percent = 100) {
        this.soundManager.setVolume(percent);
    }

    /**
     * Get notified when the position changes while the song plays.
     *
     * @param callback the callback which gets called with the current position in millis
     */
    registerOnProgressCallback(callback) {
        this.onProgressCallbacks.push(callback);
    }

    /**
     * Get notified when the song is played.
     *
     * @param callback
     */
    registerOnFinishedCallback(callback) {
        this.onFinishedCallbacks.push(callback);
    }

    registerOnLoadedCallback(callback) {
        this.onLoadedCallbacks.push(callback);
    }
}

export default new Player();
