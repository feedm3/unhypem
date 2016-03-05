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
        this.currentSongInfo = {};
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
        const currentSong = this.currentSongInfo.song;
        const newSong = songInfo.song;
        const newPlayingState = songInfo.state;

        if (!currentSong || (newSong.id !== currentSong.id)) {
            Object.assign(this.currentSongInfo, songInfo);
            this.load();
        }
        switch (newPlayingState) {
            case SONG_STATE.PLAYING:
                if (!this.smSound) songDispatcher.dispatch(ACTION.FORWARD);
                this.play();
                break;
            case SONG_STATE.PAUSED:
                this.pause();
                break;
        }
        if (songInfo.positionUpdate) {
            songInfo.positionUpdate = false;
            this.setPositionInPercent(songInfo.positionUpdatePosition);
        }
    }

    preloadSongs(songs) {
        forEach(songs, (song) => {
            if (!song.streamUrl) {
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
                    const currentSong = this.currentSongInfo.song;
                    if (this.smSound.readyState === 3) {
                        if (!currentSong.duration) {
                            // if the song is not hosted on soundcloud we have to update the duration from the soundmanager
                            currentSong.duration = this.smSound.duration;
                            songDispatcher.dispatch(ACTION.SELECT_SONG, this.currentSong);
                        }
                    }
                },
                whileplaying: () => {
                    const durationInMillis = this.currentSongInfo.song.duration;
                    const positionInMillis = parseInt(this.smSound.position, 10);
                    const positionInPercent = (positionInMillis / durationInMillis) * 100;
                    songDispatcher.dispatch(ACTION.SELECT_POSITION_IN_PERCENT, positionInPercent);
                    /**
                     * TODO there's a bug in the soundmanager which causes onfinish() not to call so we have to make a
                     * little workaround and call the next song when the current ones position is greater than 99.9
                     * percent.
                     */
                    if (positionInPercent > 99.9) {
                        songDispatcher.dispatch(ACTION.FORWARD);
                    }
                },
                onfinish: () => {
                    songDispatcher.dispatch(ACTION.FORWARD);
                }
            });
        });
    }

    /**
     * Load the current song into the smSound object.
     */
    load() {
        const songId = this.ID_PREFIX + this.currentSongInfo.song.id;
        if (!this.smSound || this.smSound.id !== songId) {
            if (this.smSound) {
                this.smSound.stop();
                this.smSound.unload();
            }
            this.soundManager.load(songId);
            this.smSound = this.soundManager.getSoundById(songId);
            if (this.smSound) {
                // if it loads a song which was not preloaded (no streaming url)
                // than the smSound object will be empty
                this.smSound.paused = true;
            }
        }
    }

    /**
     * Play the current selected song. Dont forget to load() it before.
     */
    play() {
        if (this.smSound && this.smSound.paused) {
            this.smSound.play();
        }
    }

    /**
     * Pause the current selected song.
     */
    pause() {
        if (this.smSound && !this.smSound.paused) {
            this.smSound.pause();
        }
    }

    setPositionInPercent(percent) {
        if (this.smSound) {
            this.smSound.setPosition(this.smSound.duration / 100 * percent);
        }
    }

    setVolume(percent = 100) {
        this.soundManager.setVolume(percent);
    }
}

export default new Player();
