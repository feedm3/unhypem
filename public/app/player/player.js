/**
 * @author Fabian Dietenberger
 */

'use strict';

import { SoundManager } from 'soundmanager2/script/soundmanager2-nodebug-jsmin';
import forEach from 'lodash/forEach';
import isString from 'lodash/isString';
import songDispatcher from '../dispatcher/song-dispatcher';
import ACTION from '../constants/action';
import SONG_STATE from '../constants/song-state';

class Player {
    constructor() {
        this.ID_PREFIX = 'UH_'; // soundmanager2 id needs to start with an non-numeric char
        this.currentSong = {};
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
                songDispatcher.registerOnAllSongsUpdate('Player', this.handleAllSongsUpdate.bind(this));
                songDispatcher.registerOnCurrentSongUpdate('Player', this.handleCurrentSongUpdate.bind(this));
                songDispatcher.dispatch(ACTION.GET_ALL_SONGS);
            }
        });
    }

    handleAllSongsUpdate(songsInfo) {
        this.preloadSongs(songsInfo.songs);
    }

    handleCurrentSongUpdate(songInfo) {
        const newSong = songInfo.song;
        const newPlayingState = songInfo.state;

        if (!this.currentSong || newSong.id !== this.currentSong.id) {
            this.currentSong = newSong;
        }
        switch (newPlayingState) {
            case SONG_STATE.PLAYING:
                this.play();
                break;
            case SONG_STATE.PAUSED:
                this.pause();
                break;
        }
        if (songInfo.positionUpdate) {
            console.log('update position', songInfo.positionUpdatePosition);
            songInfo.positionUpdate = false;
            this.setPositionInPercent(songInfo.positionUpdatePosition);
        }
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
                    //if (this.smSound.readyState === 3) {
                    //    this.smSound = this.soundManager.getSoundById(this.currentSongId);
                    //    this.onLoadedCallbacks.forEach(c => c());
                    //}
                },
                whileplaying: () => {
                    const durationInMillis = this.currentSong.duration;
                    const positionInMillis = parseInt(this.smSound.position, 10);
                    const positionInPercent = (positionInMillis / durationInMillis) * 100;
                    songDispatcher.dispatch(ACTION.SELECT_POSITION_IN_PERCENT, positionInPercent);
                },
                onfinish: () => {
                    songDispatcher.dispatch(ACTION.FORWARD);
                }
            });
        });
    }

    /**
     * Play the current selected song.
     */
    play() {
        const songId = this.ID_PREFIX + this.currentSong.id;
        if (!this.smSound || this.smSound.id !== songId) {
            if (this.smSound) {
                this.smSound.stop();
                this.smSound.unload();
            }
            this.smSound = this.soundManager.getSoundById(songId);
            if (this.smSound) {
                this.smSound.play();
            }
            this.isSongPlaying = true;
        } else {
            const isPlaying = !this.smSound.paused;
            if (!isPlaying) {
                this.smSound.play();
            }
        }
        this.isSongPlaying = true;
    }

    /**
     * Pause the current selected song.
     */
    pause() {
        if (this.smSound) {
            this.smSound.pause();
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

    setVolume(percent = 100) {
        this.soundManager.setVolume(percent);
    }
}

export default new Player();
